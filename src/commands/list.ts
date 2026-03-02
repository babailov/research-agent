import { readFile } from "node:fs/promises";
import { INDEX_PATH } from "../lib/paths.js";

/**
 * List all stored research articles by reading the index directly.
 * No API call needed — just reads the local markdown file.
 */
export async function list(): Promise<void> {
  try {
    const content = await readFile(INDEX_PATH, "utf-8");
    const lines = content.trim().split("\n");
    const dataRows = lines.filter(
      (line) => line.startsWith("|") && !line.startsWith("| Title") && !line.startsWith("|---")
    );

    if (dataRows.length === 0) {
      console.log("No articles stored yet. Use `research add <url>` to add one.");
      return;
    }

    console.log(content.trim());
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("No articles stored yet. Use `research add <url>` to add one.");
    } else {
      console.error("Failed to read article index:", (err as Error).message);
      process.exit(1);
    }
  }
}
