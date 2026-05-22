/**
 * SupportApp — top-level entry for the admin support web app.
 *
 * Lazy-loaded from the marketing app's root router so the chat SDK
 * (~200KB) only downloads when someone actually visits /admin/support.
 *
 *   /admin/support/login          → Login
 *   /admin/support                → ProtectedRoute(Inbox)
 *   /admin/support/anything-else  → redirect to /admin/support
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Inbox from './Inbox';
import ProtectedRoute from './ProtectedRoute';
import './styles.css';

export default function SupportApp() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route
                path=""
                element={
                    <ProtectedRoute>
                        <Inbox />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
    );
}
