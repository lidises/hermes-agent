import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { syncAssets } from "./sync-assets.mjs";

test("syncAssets copies design-system assets with Node fs APIs", async () => {
  const root = await mkdtemp(join(tmpdir(), "hermes-sync-assets-"));
  try {
    await mkdir(join(root, "public", "fonts"), { recursive: true });
    await Promise.all([
      mkdir(join(root, "node_modules", "@nous-research", "ui", "dist", "fonts"), { recursive: true }),
      mkdir(join(root, "node_modules", "@nous-research", "ui", "dist", "assets"), { recursive: true }),
    ]);
    await writeFile(join(root, "public", "fonts", "stale.txt"), "stale");
    await writeFile(join(root, "node_modules", "@nous-research", "ui", "dist", "fonts", "font.woff2"), "font");
    await writeFile(join(root, "node_modules", "@nous-research", "ui", "dist", "assets", "logo.svg"), "logo");

    await syncAssets(root);

    assert.equal(await readFile(join(root, "public", "fonts", "font.woff2"), "utf8"), "font");
    assert.equal(await readFile(join(root, "public", "ds-assets", "logo.svg"), "utf8"), "logo");
    await assert.rejects(readFile(join(root, "public", "fonts", "stale.txt"), "utf8"), { code: "ENOENT" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
