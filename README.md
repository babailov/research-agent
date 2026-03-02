# Research Agent

An AI-powered research article tracker and knowledge assistant built on [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

Feed it URLs. It fetches, summarizes, tags, indexes, and cross-references articles into a two-tier knowledge system — raw articles plus a distilled knowledge layer that grows smarter as you add more.

## What it does

- **Ingest articles** from URLs or pasted text — auto-extracts metadata, tags, and summaries
- **Build a knowledge graph** — cross-article insights, domain maps, tensions, and strategy notes emerge as your collection grows
- **Answer research questions** — searches your collection first, then the web, cites sources from both
- **Detect patterns** — surfaces connections across articles you wouldn't notice manually
- **Maintain itself** — staleness detection, terminology drift checks, orphan notes, tag consolidation

## How it works

```
articles/          Raw library. One markdown file per ingested article.
  index.md         Master table + domain groupings + cross-domain connections

knowledge/         Distilled synthesis. Cross-article insights with evidence chains.
  index.md         Hub connecting all domain maps and notes
  <domain>.md      Domain maps organizing articles by theme
  <insight>.md     Validated patterns across 2+ articles
  tension-*.md     Active disagreements between articles
```

The agent uses **progressive disclosure** to avoid reading everything on every query:

1. Knowledge hub → 2. Domain map → 3. Insight notes → 4. Article index → 5. Frontmatter triage → 6. Full read (2-3 max) → 7. Web fallback

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Node.js 20+
- npm, pnpm, or yarn

## Quick start

```bash
# Clone and install
git clone https://github.com/babailov/research-agent.git
cd research-agent
npm install
npm run build

# Link the CLI globally
npm link

# Launch the interactive research agent
research
```

That's it. The `research` command launches Claude Code with the `CLAUDE.md` instructions, turning it into a research specialist automatically.

## Usage

### Interactive mode (recommended)

```bash
research
```

Opens an interactive Claude Code session with full research capabilities. Just talk to it:

- *"Ingest this article: https://example.com/article"*
- *"What do my articles say about agent memory architectures?"*
- *"Run a synthesis sweep on articles from the last 7 days"*
- *"Trace the evidence chain behind the verification bottleneck insight"*
- *"Run knowledge maintenance"*

### CLI commands

```bash
# Ingest an article from a URL
research add https://example.com/article

# Ask a research question
research ask "What are the main approaches to agent memory?"

# List all stored articles
research list
```

> `research add` and `research ask` spawn Claude Code in print mode. For the full experience (knowledge extraction, follow-up questions, maintenance), use `research` with no arguments for interactive mode.

## Workflows

### Article ingestion

Give the agent a URL and it will:

1. Fetch and parse the article
2. Check for duplicates
3. Extract metadata (title, author, date, domain)
4. Infer tags from content, preferring existing tags
5. Write a 2-3 sentence summary
6. Save as `articles/YYYY-MM-DD-slug.md` with YAML frontmatter
7. Update the master index with domain groupings
8. Extract knowledge — extend existing insight notes, create tension notes for contradictions, or create new insight notes when 2+ articles converge
9. Check for terminology drift (synonyms and homonyms)

### Knowledge layer

The knowledge layer builds itself during ingestion. Four note types:

| Type | Purpose | Example |
|------|---------|---------|
| **Domain map** | Organizes articles and insights by theme | `ai-agents-architecture.md` |
| **Insight** | Cross-article pattern validated by 2+ sources | `verification not generation is the bottleneck.md` |
| **Tension** | Active disagreement between articles | `tension — agent autonomy vs blast radius.md` |
| **Strategy** | Actionable plan with evidence chains | `product strategy — five defensible categories.md` |

Each note tracks `sources`, `last_reinforced`, `times_cited`, `confidence`, and `status` in YAML frontmatter.

The knowledge layer isn't limited to article synthesis. Any codified preference or process can live here — for example, a writing style guide with tone rules, structure conventions, and a mandatory BS score becomes a knowledge note that the agent references whenever you ask it to draft something.

### Research queries

Ask a question and the agent will:

1. Scan the knowledge layer for relevant insights
2. Search article content via grep
3. Triage candidates by frontmatter (without reading full articles)
4. Deep-read only the 2-3 most relevant articles
5. Search the web if stored articles don't fully cover the question
6. Synthesize an answer with citations to both stored and web sources
7. Identify gaps in your collection

### Maintenance

Run `"knowledge maintenance"` in interactive mode to:

- **Orphan check** — find knowledge notes not linked by any domain map
- **Staleness review** — flag notes where `last_reinforced` > 30 days
- **Effectiveness review** — classify notes as high-utility, dormant, or decaying based on `times_cited`
- **Merge/split candidates** — notes covering overlapping or multiple distinct ideas
- **Synthesis sweep** — detect emergent cross-article patterns from recent ingestions

## Schemas

### Article frontmatter

```yaml
title: "Article Title"
author: "Author Name"
date: 2026-01-15
source: "https://example.com/article"
domain: "example.com"
tags: [ai-agents, context-engineering]
summary: "2-3 sentence summary for progressive disclosure triage."
ingested: 2026-01-15
```

### Knowledge note frontmatter

```yaml
description: "One-sentence thesis of the insight"
type: insight                    # insight | tension | strategy | moc
domains: [ai-agents, economics] # Which domain maps reference this
sources:
  - articles/2026-01-15-slug.md
  - articles/2026-01-20-slug.md
created: 2026-01-20
last_reinforced: 2026-02-01
times_cited: 3
status: active                   # active | archived
confidence: validated            # validated | speculative
```

## Permissions

The agent runs with locked-down permissions via `.claude/settings.json`:

- **Can read** everything (articles, knowledge, source code)
- **Can write** only to `articles/`
- **Can search** the web (WebSearch, WebFetch)

Knowledge files require explicit approval per-write. This prevents accidental corruption of the knowledge layer. To auto-allow knowledge writes, add to `.claude/settings.json`:

```json
"Write(knowledge/*)",
"Write(knowledge/**)",
"Edit(knowledge/*)",
"Edit(knowledge/**)"
```

## Customization

### Tags

Tags are a controlled vocabulary — lowercase, hyphenated (e.g., `ai-agents`, `context-engineering`). The agent prefers reusing existing tags. Review `articles/index.md` periodically for consolidation.

### Domain maps

Create a new domain map when 3+ articles cluster around a theme not covered by existing maps. The agent will suggest this during ingestion.

### Storing preferences in the knowledge layer

Any codified preference — writing style, review checklists, decision frameworks — can be stored as a knowledge note rather than relying on Claude Code's auto-memory (`~/.claude/projects/...`). This makes preferences version-controlled, portable, and discoverable through the normal progressive disclosure funnel.

Example: a writing style guide stored as `knowledge/writing style — honest business prose with mandatory BS scoring.md` with `type: insight` and `domains: [personal-development]` will be found whenever you ask the agent to draft a post.

### Auto-memory

Claude Code also persists learned preferences across sessions in `~/.claude/projects/<path>/memory/`. This is useful for transient preferences, but for anything durable, store it in `knowledge/` instead — it travels with the repo and survives machine changes.

## Project structure

```
src/
  cli.ts                  Commander.js entry point
  commands/
    add.ts                Ingest article via Claude print mode
    ask.ts                Research query via Claude print mode
    interactive.ts        Launch interactive Claude session
    list.ts               Read and display articles/index.md
  lib/
    claude.ts             Spawns claude child processes
    paths.ts              Resolves repo root, articles dir, index path
```

The CLI is a thin wrapper. All intelligence lives in `CLAUDE.md` — the 176-line instruction set that defines 9 workflows, knowledge extraction logic, terminology drift detection, evidence chain tracing, and synthesis sweeps.

## License

MIT
