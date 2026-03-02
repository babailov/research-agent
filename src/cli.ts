import { Command } from "commander";
import { interactive } from "./commands/interactive.js";
import { add } from "./commands/add.js";
import { ask } from "./commands/ask.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("research")
  .description("AI-powered research article tracker")
  .version("1.0.0")
  .action(interactive);

program
  .command("add <url>")
  .description("Fetch and store a research article from a URL")
  .action(add);

program
  .command("ask <question>")
  .description("Ask a research question (searches stored articles + web)")
  .action(ask);

program
  .command("list")
  .description("List all stored research articles")
  .action(list);

program.parse();
