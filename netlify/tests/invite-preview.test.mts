import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import {
  buildImageAlt,
  buildOgImageUrl,
  buildTitle,
  fetchInvitePreview,
  imageOrigin,
  INVITE_PREVIEW_API_URL,
  inviteApiUrl,
  joinByLabel,
  previewVersion,
  rewriteInviteMeta,
} from "../lib/invite-preview.mts";

const CONVO = "9f1c2b7e-4d3a-4c5b-8e6f-0a1b2c3d4e5f";
const INVITER = "p_15551234567";
const inviteHtml = readFileSync(
  new URL("../../public/invite.html", import.meta.url),
  "utf8",
);

const metaContent = (html: string, key: string): string | undefined =>
  html.match(
    new RegExp(`<meta\\s+(?:property|name)="${key}"\\s+content="([^"]*)"`),
  )?.[1];

describe("buildTitle", () => {
  it("names the inviter and the group", () => {
    assert.equal(
      buildTitle({ valid: true, groupName: "Run Club", inviterFirstName: "Maria" }),
      "Maria invited you to join -Run Club-",
    );
  });

  it("falls back to a passive title without an inviter", () => {
    assert.equal(
      buildTitle({ valid: true, groupName: "Run Club", inviterFirstName: null }),
      "You're invited to join -Run Club-",
    );
  });

  it("clamps to 60 characters", () => {
    const title = buildTitle({
      valid: true,
      groupName: "A".repeat(59) + "…",
      inviterFirstName: "Maria",
    });
    assert.equal(title?.length, 60);
    assert.ok(title?.endsWith("…"));
  });

  it("returns null without a group name", () => {
    assert.equal(buildTitle({ valid: true }), null);
  });
});

describe("previewVersion", () => {
  const base = { valid: true, groupName: "Run Club", inviterFirstName: "Maria" };

  it("is stable for the same names", () => {
    assert.equal(previewVersion(base), previewVersion({ ...base }));
    assert.match(previewVersion(base), /^[0-9a-z]{1,13}$/);
  });

  it("changes when the group is renamed", () => {
    assert.notEqual(
      previewVersion(base),
      previewVersion({ ...base, groupName: "Run Club 2" }),
    );
  });

  it("changes when the inviter name changes or goes missing", () => {
    const versions = new Set([
      previewVersion(base),
      previewVersion({ ...base, inviterFirstName: "Mario" }),
      previewVersion({ ...base, inviterFirstName: null }),
    ]);
    assert.equal(versions.size, 3);
  });

  it("changes when the join-by badge appears or the window closes", () => {
    const withDate = { ...base, nextPayDate: "2026-10-03" };
    const open = new Date("2026-10-01T12:00:00Z");
    const closed = new Date("2026-10-04T12:00:00Z");
    assert.notEqual(previewVersion(base, open), previewVersion(withDate, open));
    assert.notEqual(previewVersion(withDate, open), previewVersion(withDate, closed));
    assert.equal(previewVersion(base, closed), previewVersion(withDate, closed));
  });

  it("does not collide when text moves between the two names", () => {
    assert.notEqual(
      previewVersion({ valid: true, groupName: "ab", inviterFirstName: "c" }),
      previewVersion({ valid: true, groupName: "a", inviterFirstName: "bc" }),
    );
  });
});

describe("joinByLabel", () => {
  const now = new Date("2026-09-25T12:00:00Z");

  it("names the last day to join as a date, never a countdown", () => {
    assert.equal(joinByLabel("2026-10-03", now), "Join by Sat, Oct 3");
  });

  it("still shows on the deadline day itself", () => {
    assert.equal(joinByLabel("2026-09-25", now), "Join by Fri, Sep 25");
  });

  it("disappears once the window has closed", () => {
    assert.equal(joinByLabel("2026-09-24", now), null);
  });

  it("accepts a full ISO timestamp", () => {
    assert.equal(joinByLabel("2026-10-03T00:00:00.000Z", now), "Join by Sat, Oct 3");
  });

  it("ignores missing or malformed dates", () => {
    for (const value of [
      undefined, null, "", "soon", "10/03/2026",
      "2026-13-45", "2026-02-30", "2026-10-03garbage",
    ]) {
      assert.equal(joinByLabel(value, now), null, String(value));
    }
  });
});

describe("buildOgImageUrl", () => {
  const data = { valid: true, groupName: "Run Club", inviterFirstName: "Maria" };

  it("points at /og/invite with the ids and the version hash", () => {
    const url = new URL(
      buildOgImageUrl("https://getkeeep.com", CONVO, INVITER, data),
    );
    assert.equal(url.origin + url.pathname, "https://getkeeep.com/og/invite");
    assert.deepEqual([...url.searchParams.keys()], ["c", "i", "v"]);
    assert.equal(url.searchParams.get("c"), CONVO);
    assert.equal(url.searchParams.get("i"), INVITER);
    assert.equal(url.searchParams.get("v"), previewVersion(data));
  });

  it("never carries the names", () => {
    const url = buildOgImageUrl("https://getkeeep.com", CONVO, INVITER, data);
    assert.ok(!url.includes("Run") && !url.includes("Maria"));
  });

  it("gets a new URL when the group is renamed", () => {
    const before = buildOgImageUrl("https://getkeeep.com", CONVO, INVITER, data);
    const after = buildOgImageUrl("https://getkeeep.com", CONVO, INVITER, {
      ...data,
      groupName: "Sunrise Club",
    });
    assert.notEqual(before, after);
  });

  it("lowercases the convo id so one invite has one cache entry", () => {
    const url = new URL(
      buildOgImageUrl("https://getkeeep.com", CONVO.toUpperCase(), INVITER, data),
    );
    assert.equal(url.searchParams.get("c"), CONVO);
  });

  it("drops a missing or malformed inviter id", () => {
    for (const i of [null, "", "x", "<script>", "a".repeat(65)]) {
      const url = new URL(buildOgImageUrl("https://getkeeep.com", CONVO, i, data));
      assert.equal(url.searchParams.has("i"), false, `i=${i}`);
    }
  });
});

describe("imageOrigin", () => {
  it("forces https for public hosts", () => {
    assert.equal(
      imageOrigin(new URL("http://getkeeep.com/invite?c=1")),
      "https://getkeeep.com",
    );
    assert.equal(
      imageOrigin(new URL("https://deploy-preview-13--getkeeep.netlify.app/invite")),
      "https://deploy-preview-13--getkeeep.netlify.app",
    );
  });

  it("keeps http for local netlify dev", () => {
    assert.equal(
      imageOrigin(new URL("http://localhost:8888/invite")),
      "http://localhost:8888",
    );
  });
});

describe("rewriteInviteMeta on public/invite.html", () => {
  const data = { valid: true, groupName: "Run Club", inviterFirstName: "Maria" };
  const imageUrl = buildOgImageUrl("https://getkeeep.com", CONVO, INVITER, data);
  const html = rewriteInviteMeta(inviteHtml, {
    title: buildTitle(data)!,
    description: "Make it easier to stick to your workout goals, whatever they are",
    imageUrl,
    imageAlt: buildImageAlt(data),
  });
  const escapedUrl = imageUrl.replace(/&/g, "&amp;");

  it("points all three image tags at the personalized card", () => {
    for (const key of ["og:image", "og:image:secure_url", "twitter:image"]) {
      assert.equal(metaContent(html, key), escapedUrl, key);
    }
  });

  it("rewrites the titles and the image alt text", () => {
    assert.equal(metaContent(html, "og:title"), "Maria invited you to join -Run Club-");
    assert.equal(metaContent(html, "twitter:title"), "Maria invited you to join -Run Club-");
    assert.equal(
      metaContent(html, "og:image:alt"),
      "Maria invited you to join Run Club on Keeep",
    );
  });

  it("adds the join-by date to the alt text when there is one", () => {
    assert.equal(
      buildImageAlt(
        { ...data, nextPayDate: "2026-10-03" },
        new Date("2026-09-25T12:00:00Z"),
      ),
      "Maria invited you to join Run Club on Keeep. Join by Sat, Oct 3.",
    );
  });

  it("leaves the card size and type alone", () => {
    assert.equal(metaContent(html, "og:image:width"), "1200");
    assert.equal(metaContent(html, "og:image:height"), "630");
    assert.equal(metaContent(html, "og:image:type"), "image/png");
  });

  it("changes nothing but the eight personalized tags", () => {
    const unchanged = (s: string) =>
      s.replace(
        /<meta\s+(?:property|name)="(?:og:title|og:description|twitter:title|twitter:description|og:image|og:image:secure_url|twitter:image|og:image:alt)"\s+content="[^"]*"/g,
        "",
      );
    assert.equal(unchanged(html), unchanged(inviteHtml));
  });

  it("escapes names and keeps $ patterns literal", () => {
    const tricky = {
      valid: true,
      groupName: `Gym $$ & "Co" $1 <b>`,
      inviterFirstName: "O'Brien",
    };
    const out = rewriteInviteMeta(inviteHtml, {
      title: buildTitle(tricky)!,
      description: "d",
      imageUrl,
      imageAlt: buildImageAlt(tricky),
    });
    assert.equal(
      metaContent(out, "og:title"),
      "O&#39;Brien invited you to join -Gym $$ &amp; &quot;Co&quot; $1 &lt;b&gt;-",
    );
  });
});

describe("fetchInvitePreview", () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("asks the backend with c and i and returns its body", async () => {
    let requested = "";
    globalThis.fetch = (async (input: string) => {
      requested = input;
      return Response.json({ valid: true, groupName: "Run Club", inviterFirstName: "Maria" });
    }) as typeof fetch;
    const data = await fetchInvitePreview(CONVO, INVITER, 1000);
    assert.deepEqual(data, { valid: true, groupName: "Run Club", inviterFirstName: "Maria" });
    const url = new URL(requested);
    assert.equal(url.origin + url.pathname, INVITE_PREVIEW_API_URL);
    assert.equal(url.searchParams.get("c"), CONVO);
    assert.equal(url.searchParams.get("i"), INVITER);
  });

  it("returns null on HTTP errors, bad JSON and unexpected bodies", async () => {
    for (const response of [
      new Response("oops", { status: 500 }),
      new Response("not json"),
      Response.json({ groupName: "no valid flag" }),
    ]) {
      globalThis.fetch = (async () => response) as typeof fetch;
      assert.equal(await fetchInvitePreview(CONVO, null, 1000), null);
    }
  });

  it("uses INVITE_PREVIEW_API_URL for local testing", () => {
    process.env.INVITE_PREVIEW_API_URL = "http://localhost:8787/api/public/invite-preview";
    try {
      assert.equal(inviteApiUrl(), "http://localhost:8787/api/public/invite-preview");
    } finally {
      delete process.env.INVITE_PREVIEW_API_URL;
    }
    assert.equal(inviteApiUrl(), INVITE_PREVIEW_API_URL);
  });

  it("uses production and never throws when env access is denied", async () => {
    const g = globalThis as { Netlify?: unknown };
    g.Netlify = {
      env: {
        get() {
          throw new Error('NotCapable: Requires env access to "INVITE_PREVIEW_API_URL"');
        },
      },
    };
    try {
      assert.equal(inviteApiUrl(), INVITE_PREVIEW_API_URL);
      globalThis.fetch = (async () => Response.json({ valid: false })) as typeof fetch;
      assert.deepEqual(await fetchInvitePreview(CONVO, null, 1000), { valid: false });
    } finally {
      delete g.Netlify;
    }
  });

  it("gives up after the timeout", async () => {
    globalThis.fetch = ((_input: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal!.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError")),
        );
      })) as typeof fetch;
    const started = Date.now();
    assert.equal(await fetchInvitePreview(CONVO, null, 30), null);
    assert.ok(Date.now() - started < 1000);
  });
});
