import { spawn, type SpawnOptions } from "node:child_process";
import { REPO_ROOT } from "./paths.js";

interface SpawnClaudeOptions {
  /** Print-mode prompt (non-interactive). Omit for interactive mode. */
  prompt?: string;
  /** Additional CLI flags */
  args?: string[];
}

/**
 * Spawn a `claude` child process in the research repo directory.
 *
 * - Interactive mode: stdio: 'inherit' — user gets full Claude Code experience
 * - Print mode: stdout is piped so we can capture the response
 */
export function spawnClaude(options: SpawnClaudeOptions = {}): Promise<string> {
  const { prompt, args = [] } = options;
  const isInteractive = !prompt;

  const cliArgs: string[] = [];
  if (prompt) {
    cliArgs.push("-p", prompt);
  }
  cliArgs.push(...args);

  const env = { ...process.env };
  // Clear nesting detection so claude doesn't refuse to start
  delete env.CLAUDE_CODE;
  delete env.CLAUDE_CODE_ENTRYPOINT;

  const spawnOpts: SpawnOptions = {
    cwd: REPO_ROOT,
    env,
    stdio: isInteractive
      ? "inherit"
      : ["inherit", "pipe", "inherit"],
  };

  return new Promise((resolve, reject) => {
    const child = spawn("claude", cliArgs, spawnOpts);

    let stdout = "";

    if (!isInteractive && child.stdout) {
      child.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
      });
    }

    child.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            "Claude Code CLI not found. Install it with: npm install -g @anthropic-ai/claude-code"
          )
        );
      } else {
        reject(err);
      }
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`claude exited with code ${code}`));
      }
    });
  });
}
