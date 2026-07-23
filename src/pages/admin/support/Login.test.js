import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { api } from './api';

jest.mock('./api', () => {
    class AdminApiError extends Error {
        constructor(status, body) {
            super(body?.error || `HTTP ${status}`);
            this.status = status;
            this.body = body;
        }
    }
    return {
        api: { me: jest.fn(), login: jest.fn() },
        AdminApiError,
    };
});

beforeEach(() => {
    // Not authenticated — stay on the login screen
    api.me.mockRejectedValue(new Error('unauthenticated'));
    api.login.mockReset();
});

function renderLogin() {
    return render(
        <MemoryRouter initialEntries={['/admin/support/login']}>
            <Login />
        </MemoryRouter>
    );
}

test('password field starts masked', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
});

test('Show/Hide toggle reveals and re-masks the typed password', () => {
    renderLogin();
    const input = screen.getByPlaceholderText('Password');
    fireEvent.change(input, { target: { value: 'hunter2' } });

    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('hunter2');

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(input).toHaveAttribute('type', 'password');
});

test('submit is disabled until a password is entered', () => {
    renderLogin();
    const submit = screen.getByRole('button', { name: /sign in/i });
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'secret' },
    });
    expect(submit).toBeEnabled();
});

test('wrong password shows the error and clears the field', async () => {
    const { AdminApiError } = jest.requireMock('./api');
    api.login.mockRejectedValue(new AdminApiError(401, { error: 'invalid_password' }));

    renderLogin();
    const input = screen.getByPlaceholderText('Password');
    fireEvent.change(input, { target: { value: 'nope' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Wrong password.')).toBeInTheDocument();
    expect(input).toHaveValue('');
});
