import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import handler from "../functions/og-invite/og-invite.mts";
import {
  cardText,
  groupNameStyle,
  inviterLineSize,
} from "../functions/og-invite/render-card.mts";
import { previewVersion } from "../lib/invite-preview.mts";

const CONVO = "9f1c2b7e-4d3a-4c5b-8e6f-0a1b2c3d4e5f";
const staticCard = readFileSync(
  new URL("../../public/images/shareLink.png", import.meta.url),
);

const pngSize = (bytes: Uint8Array) => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
};

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const request = (query: string) =>
  handler(new Request(`https://getkeeep.com/og/invite?${query}`));

describe("cardText", () => {
  it("drops emoji, flags, skin tones and keycaps, then tidies spaces", () => {
    assert.equal(cardText("Book Club 📚"), "Book Club");
    assert.equal(cardText("🏃‍♀️ Run  Crew 🇺🇸"), "Run Crew");
    assert.equal(cardText("Lift 💪🏽 Club"), "Lift Club");
    assert.equal(cardText("Team 1️⃣"), "Team 1");
  });

  it("leaves ordinary text alone", () => {
    assert.equal(cardText("Café Crew — Mañana's"), "Café Crew — Mañana's");
  });

  it("returns empty for emoji-only or missing text", () => {
    assert.equal(cardText("🔥🔥"), "");
    assert.equal(cardText(null), "");
  });
});

describe("text sizing", () => {
  it("shrinks the group name as it gets longer", () => {
    const sizes = ["Run Club", "Morning Runners", "Saturday Long Run Crew", "A".repeat(60)]
      .map((name) => groupNameStyle(name).fontSize);
    assert.deepEqual([...sizes].sort((a, b) => b - a), sizes);
    assert.ok(sizes[0] > sizes[3]);
  });

  it("sizes by the longest word, which can't wrap", () => {
    assert.ok(
      groupNameStyle("Supercalifragilistic").fontSize <
        groupNameStyle("Run Club Crew Go").fontSize,
    );
  });

  it("shrinks the inviter line for long first names", () => {
    assert.ok(
      inviterLineSize(`${"M".repeat(24)} invited you to join`) <
        inviterLineSize("Maria invited you to join"),
    );
  });
});

describe("GET /og/invite", () => {
  const realFetch = globalThis.fetch;
  let apiCalls = 0;
  const backend = (body: unknown) => {
    globalThis.fetch = (async () => {
      apiCalls++;
      return Response.json(body);
    }) as typeof fetch;
  };
  afterEach(() => {
    globalThis.fetch = realFetch;
    apiCalls = 0;
  });

  const preview = { valid: true, groupName: "Run Club", inviterFirstName: "Maria" };

  it("renders a 1200×630 PNG cached for a year when v matches", async () => {
    backend(preview);
    const res = await request(`c=${CONVO}&i=p_15551234567&v=${previewVersion(preview)}`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "image/png");
    assert.equal(res.headers.get("cache-control"), "public, max-age=31536000, immutable");
    assert.equal(
      res.headers.get("netlify-cdn-cache-control"),
      "public, max-age=31536000, immutable, durable",
    );
    assert.equal(res.headers.get("netlify-vary"), "query=c|i|v");
    const png = new Uint8Array(await res.arrayBuffer());
    assert.deepEqual([...png.subarray(0, 8)], PNG_SIGNATURE);
    assert.deepEqual(pngSize(png), { width: 1200, height: 630 });
    assert.ok(!Buffer.from(png).equals(staticCard));
  });

  it("renders the current names but caches briefly when v is stale or missing", async () => {
    backend(preview);
    for (const query of [`c=${CONVO}&v=oldhash`, `c=${CONVO}`]) {
      const res = await request(query);
      assert.equal(res.headers.get("content-type"), "image/png");
      assert.equal(res.headers.get("cache-control"), "public, max-age=300");
      assert.ok(!Buffer.from(await res.arrayBuffer()).equals(staticCard));
    }
  });

  it("renders the group-only card when the inviter is unknown", async () => {
    backend({ valid: true, groupName: "Run Club", inviterFirstName: null });
    const res = await request(`c=${CONVO}&i=p_15551234567`);
    const png = new Uint8Array(await res.arrayBuffer());
    assert.deepEqual(pngSize(png), { width: 1200, height: 630 });
    assert.ok(!Buffer.from(png).equals(staticCard));
  });

  const expectStaticCard = async (res: Response) => {
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "image/png");
    assert.equal(res.headers.get("cache-control"), "public, max-age=60");
    assert.ok(Buffer.from(await res.arrayBuffer()).equals(staticCard));
  };

  it("serves the static card without calling the backend for bad params", async () => {
    backend(preview);
    for (const query of ["", "c=garbage", "c=1234", `g=Hacked&i=p_15551234567`]) {
      await expectStaticCard(await request(query));
    }
    assert.equal(apiCalls, 0);
  });

  it("serves the static card when the backend has no such group", async () => {
    backend({ valid: false });
    await expectStaticCard(await request(`c=${CONVO}`));
  });

  it("serves the static card when the backend is down", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    await expectStaticCard(await request(`c=${CONVO}`));
  });

  it("serves the static card for names Manrope can't draw", async () => {
    backend({ valid: true, groupName: "東京ランナーズ", inviterFirstName: "Ken" });
    await expectStaticCard(await request(`c=${CONVO}`));
    backend({ valid: true, groupName: "🔥🔥🔥", inviterFirstName: "Ken" });
    await expectStaticCard(await request(`c=${CONVO}`));
  });

  it("ignores a name passed in the URL", async () => {
    backend(preview);
    const withName = await request(`c=${CONVO}&g=Hacked&name=Hacked`);
    const without = await request(`c=${CONVO}`);
    assert.ok(
      Buffer.from(await withName.arrayBuffer()).equals(
        Buffer.from(await without.arrayBuffer()),
      ),
    );
  });
});
