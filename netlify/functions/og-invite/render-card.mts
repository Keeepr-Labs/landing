/**
 * Renders the personalized invite card: a 1200×630 PNG, Satori (layout →
 * SVG) then resvg (WebAssembly, SVG → PNG). The fonts, wordmark, twirl,
 * fallback card and resvg's .wasm are read from disk; netlify.toml ships
 * them with the function through `included_files`.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { initWasm, Resvg } from "@resvg/resvg-wasm";

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

// Brand tokens (Keeep-mobile utils/ColorsAndFonts.ts).
const INK = "#201B33"; // grey900
const YELLOW = "#FFD562"; // yellowAccent
const WHITE_SECONDARY = "rgba(255, 255, 255, 0.78)"; // textWhiteSecondary

// Relative to the site root. Keep in sync with included_files in netlify.toml.
export const ASSETS = {
  fontSemiBold: "public/fonts/static/Manrope-SemiBold.ttf",
  fontExtraBold: "public/fonts/static/Manrope-ExtraBold.ttf",
  wordmark: "public/images/LogoWhite.svg",
  twirl: "public/images/twirlWhite.svg",
  fallbackCard: "public/images/shareLink.png",
  resvgWasm: "node_modules/@resvg/resvg-wasm/index_bg.wasm",
} as const;

// The site root is the working directory under `netlify dev`, `node --test`
// and in the deployed function (included files keep their repo-relative
// paths). Walking up from this module is a fallback for other layouts.
const assetRoots = (): string[] => {
  const roots = [process.cwd()];
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < 5; depth++) {
    roots.push(dir);
    dir = path.dirname(dir);
  }
  return roots;
};

export const readAsset = (relativePath: string): Buffer => {
  for (const root of assetRoots()) {
    const candidate = path.join(root, relativePath);
    if (existsSync(candidate)) return readFileSync(candidate);
  }
  throw new Error(`og-invite asset not found: ${relativePath}`);
};

const svgDataUri = (svg: Buffer | string): string =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

// Loaded once per function instance.
let fonts:
  | { name: string; data: Buffer; weight: 600 | 800; style: "normal" }[]
  | undefined;
let wordmarkSrc: string | undefined;
let backgroundSrc: string | undefined;
let resvgReady: Promise<void> | undefined;

const loadFonts = () =>
  (fonts ??= [
    {
      name: "Manrope",
      data: readAsset(ASSETS.fontSemiBold),
      weight: 600,
      style: "normal",
    },
    {
      name: "Manrope",
      data: readAsset(ASSETS.fontExtraBold),
      weight: 800,
      style: "normal",
    },
  ]);

const loadWordmark = () =>
  (wordmarkSrc ??= svgDataUri(readAsset(ASSETS.wordmark)));

const ensureResvg = () =>
  (resvgReady ??= initWasm(readAsset(ASSETS.resvgWasm)).catch((error) => {
    resvgReady = undefined; // let the next request retry
    throw error;
  }));

const svgToPng = (svg: string): Uint8Array => {
  const resvg = new Resvg(svg);
  try {
    const image = resvg.render();
    try {
      return image.asPng();
    } finally {
      image.free();
    }
  } finally {
    resvg.free();
  }
};

/**
 * The brand field: purple gradient under the site's twirl (twirlWhite.svg,
 * 12% white), big and bleeding off the edges like shareLink.png. The twirl
 * embeds a 2732×2048 texture that costs ~1 s to rasterize, so the field is
 * rendered once per instance and reused as a flat PNG.
 */
const loadBackground = async (): Promise<string> => {
  if (backgroundSrc) return backgroundSrc;
  await ensureResvg();
  const twirl = svgDataUri(readAsset(ASSETS.twirl));
  // twirlWhite.svg is 1228×1041; scaled 1.45×.
  const field = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  <defs><linearGradient id="field" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4A28D8"/><stop offset="1" stop-color="#221266"/>
  </linearGradient></defs>
  <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#field)"/>
  <image x="-260" y="-330" width="1781" height="1509" xlink:href="${twirl}"/>
</svg>`;
  backgroundSrc = `data:image/png;base64,${Buffer.from(svgToPng(field)).toString("base64")}`;
  return backgroundSrc;
};

// Emoji and their joiners, variation selectors, skin tones, flags and
// keycaps. Manrope has no glyphs for them, so they are dropped from the
// image (the text title still shows them).
const EMOJI_RE =
  /\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|[\u200D\uFE0E\uFE0F\u20E3]|[\u{E0020}-\u{E007F}]/gu;

export const cardText = (s: string | null | undefined): string =>
  (s ?? "").replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();

const charCount = (s: string): number => [...s].length;

// Size tiers for the group name, by total length and by its longest word
// (a word can't wrap, so it must fit one 1040px line on its own). The
// backend caps names at 60 characters. A badge takes a line's worth of
// height, so it caps the name at two lines.
export const groupNameStyle = (
  name: string,
  hasBadge = false,
): { fontSize: number; maxLines: number } => {
  const chars = charCount(name);
  const longestWord = Math.max(0, ...name.split(" ").map(charCount));
  const maxLines = hasBadge ? 2 : 3;
  if (chars <= 12 && longestWord <= 11) return { fontSize: 120, maxLines: 2 };
  if (chars <= 20 && longestWord <= 13) return { fontSize: 104, maxLines: 2 };
  if (chars <= 30 && longestWord <= 16) return { fontSize: hasBadge ? 84 : 92, maxLines };
  if (chars <= 44 && longestWord <= 19) return { fontSize: hasBadge ? 72 : 80, maxLines };
  return { fontSize: hasBadge ? 64 : 68, maxLines };
};

// The inviter line holds a first name of up to 24 characters.
export const inviterLineSize = (line: string): number => {
  const chars = charCount(line);
  if (chars <= 30) return 50;
  if (chars <= 38) return 42;
  return 34;
};

type CardNode = {
  type: string;
  props: Record<string, unknown>;
};

const el = (
  type: string,
  props: Record<string, unknown>,
  children?: CardNode | CardNode[] | string,
): CardNode => ({ type, props: { ...props, children } });

const clockIcon = el(
  "svg",
  { width: 30, height: 30, viewBox: "0 0 30 30" },
  [
    el("circle", { cx: 15, cy: 15, r: 12, fill: "none", stroke: INK, strokeWidth: 3 }),
    el("path", {
      d: "M15 8.5V15l4.5 3",
      fill: "none",
      stroke: INK,
      strokeWidth: 3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  ],
);

export interface CardContent {
  inviter: string; // "" when unknown
  groupName: string;
  badge: string | null;
}

export const buildCard = (
  { inviter, groupName, badge }: CardContent,
  art: { background: string; wordmark: string },
): CardNode => {
  const lead = inviter ? "invited you to join" : "You’re invited to join";
  const { fontSize, maxLines } = groupNameStyle(groupName, Boolean(badge));
  return el(
    "div",
    {
      style: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "0 80px",
        color: "#FFFFFF",
        fontFamily: "Manrope",
      },
    },
    [
      el("img", {
        src: art.background,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        style: { position: "absolute", left: 0, top: 0 },
      }),
      el(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "100%",
            marginTop: -32, // optical center, above the wordmark
          },
        },
        [
          // "Maria invited you to join": the name carries the weight.
          el(
            "div",
            {
              style: {
                display: "flex",
                fontSize: inviterLineSize(`${inviter} ${lead}`),
                letterSpacing: "-0.015em",
                whiteSpace: "nowrap",
              },
            },
            inviter
              ? [
                  el("div", { style: { fontWeight: 800, marginRight: "0.28em" } }, inviter),
                  el("div", { style: { fontWeight: 600, color: WHITE_SECONDARY } }, lead),
                ]
              : [el("div", { style: { fontWeight: 600, color: WHITE_SECONDARY } }, lead)],
          ),
          el(
            "div",
            {
              style: {
                display: "block",
                marginTop: 10,
                maxWidth: "100%",
                fontSize,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                textAlign: "center",
                wordBreak: "break-word",
                lineClamp: maxLines,
              },
            },
            groupName,
          ),
          ...(badge
            ? [
                el(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      marginTop: 36,
                      padding: "12px 26px 12px 20px",
                      borderRadius: 999,
                      backgroundColor: YELLOW,
                      color: INK,
                      fontSize: 30,
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                    },
                  },
                  [clockIcon, el("div", { style: { marginLeft: 12 } }, badge)],
                ),
              ]
            : []),
        ],
      ),
      // The wordmark signs the card quietly. LogoWhite.svg is 902×310.
      el("img", {
        src: art.wordmark,
        width: 100,
        height: 34,
        style: { position: "absolute", bottom: 38, left: 550, opacity: 0.6 },
      }),
    ],
  );
};

/**
 * PNG bytes of the card, or null when the names can't be drawn with
 * Manrope (e.g. CJK or Arabic script) — the caller then serves the static
 * card instead of an image with missing glyphs.
 */
export const renderInviteCard = async (content: {
  groupName: string;
  inviterFirstName: string | null;
  badge: string | null;
}): Promise<Uint8Array | null> => {
  const groupName = cardText(content.groupName);
  if (!groupName) return null;

  // Satori asks for extra fonts only when a character is missing from
  // Manrope; treat that as "can't render".
  let missingGlyphs = false;
  const svg = await satori(
    buildCard(
      { inviter: cardText(content.inviterFirstName), groupName, badge: content.badge },
      { background: await loadBackground(), wordmark: loadWordmark() },
    ) as never,
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fonts: loadFonts(),
      loadAdditionalAsset: async () => {
        missingGlyphs = true;
        return [];
      },
    },
  );
  if (missingGlyphs) return null;
  return svgToPng(svg);
};
