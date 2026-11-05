/**
 * Right-to-left names (Arabic, Persian, Urdu, Hebrew…) on the invite card.
 *
 * Satori lays text out left to right only: depending on the string it
 * reverses Arabic letters, breaks their joining or swaps word order, so
 * these names never go through Satori's text layout. resvg draws them
 * instead (it shapes with rustybuzz and runs the Unicode bidi algorithm,
 * so joining, word order and mixed Latin/Arabic all come out right), in
 * the script's Noto Sans with Manrope for any Latin, and the result goes
 * on the card as an image, trimmed to the text.
 */

import { loadFallbackFonts } from "./fallback-fonts.mts";

const RTL =
  /[\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}\p{Script=Adlam}]/u;

export const isRtl = (s: string): boolean => RTL.test(s);

// The paragraph direction is the first strong letter's, as in a chat
// bubble: "Run Club רצים" reads left to right, "רצים Run Club" right to left.
const LETTER = /\p{L}/u;
export const baseDirection = (s: string): "rtl" | "ltr" => {
  const first = [...s].find((ch) => LETTER.test(ch));
  return first && RTL.test(first) ? "rtl" : "ltr";
};

const languageOf = (s: string): string =>
  /\p{Script=Hebrew}/u.test(s) ? "he-IL" : "ar-AR";

const escapeXml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface TextImage {
  src: string; // data: URI of a PNG drawn at 2x, for sharpness
  width: number; // layout size on the card, in card pixels
  height: number;
}

/** Renders an SVG with these fonts: the PNG, and the ink's box in SVG pixels. */
export type SvgDrawer = (
  svg: string,
  fonts: Uint8Array[],
  defaultFamily: string,
) => { png: Uint8Array; ink: { x: number; width: number } | null };

const SCALE = 2;
const PAD = 2;

/**
 * The text as an image at `fontSize` (smaller when it would be wider than
 * `maxWidth`), or null when its font can't be loaded: the caller then
 * serves the static card.
 */
export const drawRtlText = async (
  text: string,
  opts: {
    fontSize: number;
    weight: 600 | 800;
    color: string;
    maxWidth: number;
    manrope: Uint8Array;
    draw: SvgDrawer;
  },
): Promise<TextImage | null> => {
  const fonts = await loadFallbackFonts(languageOf(text), text);
  const fallback = fonts?.find((f) => f.weight === opts.weight);
  if (!fallback) return null;
  const buffers = [opts.manrope, new Uint8Array(fallback.data)];
  const dir = baseDirection(text);
  const family = `Manrope, '${fallback.name}'`;

  // The text anchored at x on a canvas `width` wide (card pixels).
  const svg = (size: number, width: number, x: number) => {
    const height = Math.ceil(size * 1.5);
    return {
      height,
      markup:
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width * SCALE}" height="${height * SCALE}" viewBox="0 0 ${width} ${height}">` +
        `<text x="${x}" y="${Math.round(size * 1.1)}" direction="${dir}" font-family="${family}" font-weight="${opts.weight}" font-size="${size}" letter-spacing="${(-0.015 * size).toFixed(2)}" fill="${opts.color}">${escapeXml(text)}</text></svg>`,
    };
  };

  // Measure on a canvas wide enough for any name, shrink to fit, then
  // draw again on a canvas trimmed to the ink.
  const measure = (size: number) => {
    const width = Math.ceil(size * [...text].length) + 200;
    const x = dir === "rtl" ? width - 100 : 100;
    const { ink } = opts.draw(svg(size, width, x).markup, buffers, fallback.name);
    return ink && { size, width, x, ink };
  };
  let m = measure(opts.fontSize);
  if (m && m.ink.width > opts.maxWidth) {
    m = measure(Math.floor((opts.fontSize * opts.maxWidth) / m.ink.width));
  }
  if (!m) return null;

  const width = Math.ceil(m.ink.width) + 2 * PAD;
  const { markup, height } = svg(m.size, width, m.x - m.ink.x + PAD);
  const { png } = opts.draw(markup, buffers, fallback.name);
  return {
    src: `data:image/png;base64,${Buffer.from(png).toString("base64")}`,
    width,
    height,
  };
};
