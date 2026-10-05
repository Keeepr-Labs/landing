/**
 * Deploy-artifact check for the og-invite function (`npm run check:og-bundle`).
 *
 * Unit tests run against node_modules; the deployed function only has what
 * Netlify's bundler packs. Files read at runtime (fonts, wasm) must be listed
 * in netlify.toml `included_files` — a missing one makes every render fall
 * back to the static card, silently. This builds the real zip, unpacks it
 * outside the repo (so nothing resolves from the repo's node_modules) and
 * renders one card from it.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "inherit"] }).toString();

console.log("Bundling functions with netlify build --offline…");
run("npx", ["-y", "netlify-cli@latest", "build", "--offline"], root);

const lambda = mkdtempSync(path.join(tmpdir(), "og-invite-bundle-"));
try {
  run("unzip", ["-q", path.join(root, ".netlify/functions/og-invite.zip"), "-d", lambda]);

  // stdout carries only the PNG; the handler's logs go to stderr.
  const probe = `
    console.log = console.error;
    const { default: handler } = await import(process.cwd() + "/netlify/functions/og-invite/og-invite.mjs");
    globalThis.fetch = async () => Response.json({ valid: true, groupName: "Run Club", inviterFirstName: "Maria" });
    const res = await handler(new Request("https://getkeeep.com/og/invite?c=9f1c2b7e-4d3a-4c5b-8e6f-0a1b2c3d4e5f"));
    process.stdout.write(Buffer.from(await res.arrayBuffer()).toString("base64"));
  `;
  const png = Buffer.from(
    run(process.execPath, ["--input-type=module", "-e", probe], lambda),
    "base64",
  );

  const fallback = readFileSync(path.join(root, "public/images/shareLink.png"));
  if (png.equals(fallback)) {
    throw new Error(
      "The bundled function served the static card: a runtime file is missing " +
        "from included_files in netlify.toml (see the error logged above).",
    );
  }
  if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
    throw new Error("The bundled function returned an image that isn't 1200×630.");
  }
  console.log(`OK: the deployable og-invite bundle rendered a ${png.length}-byte card.`);
} finally {
  rmSync(lambda, { recursive: true, force: true });
}
