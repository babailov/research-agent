import { spawnClaude } from "../lib/claude.js";

/**
 * Launch an interactive Claude Code session in the research repo.
 * The CLAUDE.md in the repo root makes it behave as a research specialist.
 */
export async function interactive(): Promise<void> {
  try {
    await spawnClaude();
  } catch (err) {
    console.error(
      (err as Error).message || "Failed to launch Claude Code session"
    );
    process.exit(1);
  }
}
