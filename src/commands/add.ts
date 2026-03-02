import { spawnClaude } from "../lib/claude.js";

/**
 * Add a research article by URL.
 * Spawns claude in print mode with instructions to fetch, format, and store the article.
 */
export async function add(url: string): Promise<void> {
  const prompt = [
    `Ingest the following research article: ${url}`,
    "",
    "Follow the article ingestion workflow from CLAUDE.md:",
    "1. WebFetch the URL and extract the article content",
    "2. Extract metadata (title, author, date, tags, summary)",
    "3. Check for duplicates by grepping the source URL in articles/",
    "4. Write the article as articles/YYYY-MM-DD-slug.md with YAML frontmatter",
    "5. Update articles/index.md with the new entry",
    "6. Print a confirmation with the article title and file path",
  ].join("\n");

  try {
    const output = await spawnClaude({ prompt });
    if (output) {
      console.log(output);
    }
  } catch (err) {
    console.error((err as Error).message || "Failed to add article");
    process.exit(1);
  }
}
