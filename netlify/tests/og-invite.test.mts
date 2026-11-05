import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import handler from "../functions/og-invite/og-invite.mts";
import {
  cardText,
  groupNameStyle,
  inviterLineSize,
} from "../functions/og-invite/render-card.mts";
import { baseDirection, isRtl } from "../functions/og-invite/rtl.mts";
import { fallbackFamily } from "../functions/og-invite/fallback-fonts.mts";
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

  it("keeps the group name to two lines when a badge sits below it", () => {
    assert.equal(groupNameStyle("A".repeat(60), true).maxLines, 2);
    assert.ok(
      groupNameStyle("Saturday Long Run Crew", true).fontSize <
        groupNameStyle("Saturday Long Run Crew").fontSize,
    );
  });

  it("shrinks the inviter line for long first names", () => {
    assert.ok(
      inviterLineSize(`${"M".repeat(24)} invited you to join`) <
        inviterLineSize("Maria invited you to join"),
    );
  });
});

describe("fallback fonts", () => {
  it("picks the script's Noto Sans, the first known code winning", () => {
    assert.equal(fallbackFamily("ja-JP"), "Noto Sans JP");
    assert.equal(fallbackFamily("ja-JP|zh-CN|zh-TW|zh-HK"), "Noto Sans JP");
    assert.equal(fallbackFamily("he-IL"), "Noto Sans Hebrew");
    assert.equal(fallbackFamily("something-new"), "Noto Sans");
    assert.equal(fallbackFamily("emoji"), null);
  });

  it("sends right-to-left names to resvg, in the direction of their first letter", () => {
    assert.equal(isRtl("Run Club"), false);
    assert.equal(isRtl("東京ランナーズ"), false);
    assert.equal(isRtl("רצים בבוקר"), true);
    assert.equal(isRtl("نادي الجري"), true);
    assert.equal(baseDirection("نادي الجري"), "rtl");
    assert.equal(baseDirection("Run Club רצים"), "ltr");
    assert.equal(baseDirection("רצים Run Club"), "rtl");
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

  it("draws the join-by badge while the window is open", async () => {
    const inThreeDays = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
    const withDate = { ...preview, nextPayDate: inThreeDays };
    backend(withDate);
    const badged = await request(`c=${CONVO}&v=${previewVersion(withDate)}`);
    assert.equal(badged.headers.get("cache-control"), "public, max-age=31536000, immutable");
    backend(preview);
    const plain = await request(`c=${CONVO}&v=${previewVersion(preview)}`);
    assert.ok(
      !Buffer.from(await badged.arrayBuffer()).equals(Buffer.from(await plain.arrayBuffer())),
    );
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

  // The backend, plus Google Fonts answering with a subset of Noto Sans JP
  // (fixtures, cut for "東京ランナーズ"), or failing.
  const fontFixture = (script: "jp" | "arabic", weight: 600 | 800) =>
    readFileSync(new URL(`./fixtures/noto-sans-${script}-${weight}-subset.ttf`, import.meta.url));
  let fontCalls = 0;
  const backendWithFonts = (body: unknown, fontsUp: boolean) => {
    globalThis.fetch = (async (input: string | URL | Request) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      if (url.hostname === "fonts.googleapis.com") {
        fontCalls++;
        if (!fontsUp) return new Response("", { status: 503 });
        const weight = url.searchParams.get("family")!.endsWith("800") ? 800 : 600;
        return new Response(
          `@font-face { src: url(https://fonts.gstatic.com/${url.searchParams.get("family")!.includes("Arabic") ? "arabic" : "jp"}-${weight}.ttf) format('truetype'); }`,
        );
      }
      if (url.hostname === "fonts.gstatic.com") {
        const script = url.pathname.includes("arabic") ? "arabic" : "jp";
        return new Response(fontFixture(script, url.pathname.includes("800") ? 800 : 600));
      }
      apiCalls++;
      return Response.json(body);
    }) as typeof fetch;
  };
  afterEach(() => {
    fontCalls = 0;
  });

  it("draws names Manrope can't in the script's Noto Sans", async () => {
    backendWithFonts({ valid: true, groupName: "東京ランナーズ", inviterFirstName: "Ken" }, true);
    const res = await request(`c=${CONVO}`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("cache-control"), "public, max-age=300");
    const png = new Uint8Array(await res.arrayBuffer());
    assert.deepEqual(pngSize(png), { width: 1200, height: 630 });
    assert.ok(!Buffer.from(png).equals(staticCard));
    assert.ok(fontCalls > 0);
  });

  it("serves the static card when the fallback font can't be loaded", async () => {
    // Satori keeps fonts it loaded for the life of the instance, so this
    // uses characters the test above didn't.
    backendWithFonts({ valid: true, groupName: "大阪", inviterFirstName: "Ken" }, false);
    await expectStaticCard(await request(`c=${CONVO}`));
  });

  it("draws Arabic names (group and inviter) instead of the static card", async () => {
    backendWithFonts({ valid: true, groupName: "نادي الجري", inviterFirstName: "نادي" }, true);
    const res = await request(`c=${CONVO}`);
    const png = new Uint8Array(await res.arrayBuffer());
    assert.deepEqual(pngSize(png), { width: 1200, height: 630 });
    assert.ok(!Buffer.from(png).equals(staticCard));
  });

  it("serves the static card for Arabic names when the font can't be loaded", async () => {
    backendWithFonts({ valid: true, groupName: "نادي الجري", inviterFirstName: "Ken" }, false);
    await expectStaticCard(await request(`c=${CONVO}`));
  });

  it("serves the static card for emoji-only names, without fetching fonts", async () => {
    backendWithFonts({ valid: true, groupName: "🔥🔥🔥", inviterFirstName: "Ken" }, true);
    await expectStaticCard(await request(`c=${CONVO}`));
    assert.equal(fontCalls, 0);
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
