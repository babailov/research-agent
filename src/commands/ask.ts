import { spawnClaude } from "../lib/claude.js";

/**
 * Ask a research question.
 * Spawns claude in print mode to search stored articles + web and synthesize an answer.
 */
export async function ask(question: string): Promise<void> {
  const prompt = [
    `Research question: ${question}`,
    "",
    "Follow the research query workflow from CLAUDE.md:",
    "1. Search stored articles using Grep and Glob for relevant content",
    "2. Read the top relevant articles",
    "3. Assess if stored articles fully answer the question",
    "4. If needed, WebSearch for additional sources",
    "5. Synthesize a comprehensive answer with citations from both stored and web sources",
    "6. Note any knowledge gaps and suggest articles to add",
  ].join("\n");

  try {
    const output = await spawnClaude({ prompt });
    if (output) {
      console.log(output);
    }
  } catch (err) {
    console.error((err as Error).message || "Failed to answer question");
    process.exit(1);
  }
}
