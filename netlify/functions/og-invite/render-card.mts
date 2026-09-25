/**
 * Renders the personalized invite card: a 1200×630 PNG, Satori (layout →
 * SVG) then resvg (WebAssembly, SVG → PNG). The fonts, wordmark, fallback
 * card and resvg's .wasm are read from disk; netlify.toml ships them with
 * the function through `included_files`.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { initWasm, Resvg } from "@resvg/resvg-wasm";

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

// Relative to the site root. Keep in sync with included_files in netlify.toml.
export const ASSETS = {
  fontSemiBold: "public/fonts/static/Manrope-SemiBold.ttf",
  fontExtraBold: "public/fonts/static/Manrope-ExtraBold.ttf",
  wordmark: "public/images/LogoWhite.svg",
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

// Loaded once per function instance.
let fonts:
  | { name: string; data: Buffer; weight: 600 | 800; style: "normal" }[]
  | undefined;
let wordmarkSrc: string | undefined;
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
  (wordmarkSrc ??= `data:image/svg+xml;base64,${readAsset(
    ASSETS.wordmark,
  ).toString("base64")}`);

const ensureResvg = () =>
  (resvgReady ??= initWasm(readAsset(ASSETS.resvgWasm)).catch((error) => {
    resvgReady = undefined; // let the next request retry
    throw error;
  }));

// Emoji and their joiners, variation selectors, skin tones, flags and
// keycaps. Manrope has no glyphs for them, so they are dropped from the
// image (the text title still shows them).
const EMOJI_RE =
  /\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|[‍︎️⃣]|[\u{E0020}-\u{E007F}]/gu;

export const cardText = (s: string | null | undefined): string =>
  (s ?? "").replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();

const charCount = (s: string): number => [...s].length;

// Size tiers for the group name, by total length and by its longest word
// (a word can't wrap, so it must fit one 1040px line on its own). The
// backend caps names at 60 characters.
export const groupNameStyle = (
  name: string,
): { fontSize: number; maxLines: number } => {
  const chars = charCount(name);
  const longestWord = Math.max(0, ...name.split(" ").map(charCount));
  if (chars <= 12 && longestWord <= 11) return { fontSize: 128, maxLines: 2 };
  if (chars <= 20 && longestWord <= 13) return { fontSize: 112, maxLines: 2 };
  if (chars <= 30 && longestWord <= 16) return { fontSize: 96, maxLines: 3 };
  if (chars <= 44 && longestWord <= 19) return { fontSize: 80, maxLines: 3 };
  return { fontSize: 68, maxLines: 3 };
};

// The inviter line holds a first name of up to 24 characters.
export const inviterLineSize = (line: string): number => {
  const chars = charCount(line);
  if (chars <= 32) return 44;
  if (chars <= 40) return 38;
  return 32;
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

export const buildCard = (
  inviterLine: string,
  groupName: string,
  wordmark: string,
): CardNode => {
  const { fontSize, maxLines } = groupNameStyle(groupName);
  return el(
    "div",
    {
      style: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 80px 72px",
        backgroundImage: "linear-gradient(135deg, #4A28D8 0%, #221266 100%)",
        color: "#FFFFFF",
        fontFamily: "Manrope",
      },
    },
    [
      // LogoWhite.svg is 902×310.
      el("img", { src: wordmark, width: 186, height: 64 }),
      el(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            width: "100%",
          },
        },
        [
          el(
            "div",
            {
              style: {
                fontSize: inviterLineSize(inviterLine),
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.78)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              },
            },
            inviterLine,
          ),
          el(
            "div",
            {
              style: {
                display: "block",
                marginTop: 12,
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
        ],
      ),
    ],
  );
};

/**
 * PNG bytes of the card, or null when the names can't be drawn with
 * Manrope (e.g. CJK or Arabic script) — the caller then serves the static
 * card instead of an image with missing glyphs.
 */
export const renderInviteCard = async (names: {
  groupName: string;
  inviterFirstName: string | null;
}): Promise<Uint8Array | null> => {
  const groupName = cardText(names.groupName);
  if (!groupName) return null;
  const inviter = cardText(names.inviterFirstName);
  const inviterLine = inviter
    ? `${inviter} invited you to join`
    : "You’re invited to join";

  // Satori asks for extra fonts only when a character is missing from
  // Manrope; treat that as "can't render".
  let missingGlyphs = false;
  const svg = await satori(
    buildCard(inviterLine, groupName, loadWordmark()) as never,
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

  await ensureResvg();
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
