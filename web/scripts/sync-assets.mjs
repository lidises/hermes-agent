import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_WEB_ROOT = join(SCRIPT_DIR, "..");

const ASSET_PAIRS = [
  ["node_modules/@nous-research/ui/dist/fonts", "public/fonts"],
  ["node_modules/@nous-research/ui/dist/assets", "public/ds-assets"],
];

export async function syncAssets(webRoot = DEFAULT_WEB_ROOT) {
  for (const [source, destination] of ASSET_PAIRS) {
    const sourcePath = join(webRoot, source);
    const destinationPath = join(webRoot, destination);
    await rm(destinationPath, { recursive: true, force: true });
    await mkdir(dirname(destinationPath), { recursive: true });
    await cp(sourcePath, destinationPath, { recursive: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await syncAssets();
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(`Failed to sync dashboard assets: ${message}`);
    process.exitCode = 1;
  }
}
