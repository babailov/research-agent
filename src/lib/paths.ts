import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Resolve the research repo root directory.
 * In the built bundle, cli.js lives at dist/cli.js, so repo root is one level up.
 */
export const REPO_ROOT = resolve(__dirname, "..");

export const ARTICLES_DIR = resolve(REPO_ROOT, "articles");
export const INDEX_PATH = resolve(ARTICLES_DIR, "index.md");
