/**
 * Fallback fonts for names Manrope can't draw (Japanese, Arabic, Hebrew,
 * Thai, Devanagari…). Satori asks for them per script through
 * loadAdditionalAsset; we answer with the matching Noto Sans, a neutral
 * sans-serif, subset by Google Fonts to just the characters on the card
 * (a few KB instead of megabytes), in the card's two weights.
 *
 * Never throws: any failure (network, timeout, unknown script, a font
 * Satori can't parse) returns null and the caller serves the static card,
 * as it did before this fallback existed.
 */

export type FallbackFont = {
  name: string;
  data: ArrayBuffer;
  weight: 600 | 800;
  style: "normal";
};

// Satori's language codes (satori/src/language.ts) → Noto Sans family.
const FAMILY: Record<string, string> = {
  "ja-JP": "Noto Sans JP",
  "ko-KR": "Noto Sans KR",
  "zh-CN": "Noto Sans SC",
  "zh-TW": "Noto Sans TC",
  "zh-HK": "Noto Sans HK",
  "th-TH": "Noto Sans Thai",
  "bn-IN": "Noto Sans Bengali",
  "ar-AR": "Noto Sans Arabic",
  "ta-IN": "Noto Sans Tamil",
  "ml-IN": "Noto Sans Malayalam",
  "he-IL": "Noto Sans Hebrew",
  "te-IN": "Noto Sans Telugu",
  devanagari: "Noto Sans Devanagari",
  kannada: "Noto Sans Kannada",
  unknown: "Noto Sans",
};

// Satori joins the codes a run of text could belong to with "|" (kanji
// alone reads as "ja-JP|zh-CN|zh-TW|zh-HK"); the first one we know wins.
export const fallbackFamily = (languageCode: string): string | null => {
  const codes = languageCode.split("|");
  if (codes.includes("emoji")) return null;
  const known = codes.find((code) => code in FAMILY);
  return known ? FAMILY[known] : FAMILY.unknown;
};

// An old Safari user agent makes Google Fonts answer with TrueType, which
// Satori reads; current browsers get woff2, which it can't.
const TTF_USER_AGENT =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

const CSS_API = "https://fonts.googleapis.com/css2";

const subsetId = (text: string): string => {
  let hash = 0;
  for (const ch of text) hash = (Math.imul(hash, 31) + ch.codePointAt(0)!) >>> 0;
  return hash.toString(36);
};

const fetchWithTimeout = async (
  url: string,
  timeoutMs: number,
  init: RequestInit = {},
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const loadWeight = async (
  family: string,
  weight: 600 | 800,
  text: string,
  timeoutMs: number,
): Promise<FallbackFont | null> => {
  const css = new URL(CSS_API);
  css.searchParams.set("family", `${family}:wght@${weight}`);
  css.searchParams.set("text", text);
  const cssRes = await fetchWithTimeout(css.toString(), timeoutMs, {
    headers: { "user-agent": TTF_USER_AGENT },
  });
  if (!cssRes.ok) return null;
  const src = /src:\s*url\(([^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/.exec(
    await cssRes.text(),
  )?.[1];
  if (!src || !src.startsWith("https://")) return null;
  const fontRes = await fetchWithTimeout(src, timeoutMs);
  if (!fontRes.ok) return null;
  // Each subset gets its own name: Satori keeps one font per name and
  // weight, so a second subset of the same family (kana, then kanji) would
  // otherwise be dropped and its characters drawn as boxes.
  return {
    name: `${family} ${subsetId(text)}`,
    data: await fontRes.arrayBuffer(),
    weight,
    style: "normal",
  };
};

/**
 * Both card weights of the Noto Sans for this script, subset to `text`,
 * or null when they can't be had.
 */
export const loadFallbackFonts = async (
  languageCode: string,
  text: string,
  timeoutMs = 2500,
): Promise<FallbackFont[] | null> => {
  const family = fallbackFamily(languageCode);
  if (!family || !text.trim()) return null;
  // A run can hold the spaces between its words; keep one in the subset.
  text = text.includes(" ") ? text : `${text} `;
  try {
    const fonts = await Promise.all([
      loadWeight(family, 600, text, timeoutMs),
      loadWeight(family, 800, text, timeoutMs),
    ]);
    return fonts.every(Boolean) ? (fonts as FallbackFont[]) : null;
  } catch {
    return null;
  }
};
