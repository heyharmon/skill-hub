# SkillHub

A local browser for exploring Claude skills stored in `.claude/skills/`.

SkillHub reads skill folders, parses their `SKILL.md` frontmatter and markdown body, and presents everything in a dark-themed web UI with a file tree and syntax-highlighted viewer.

## Quick Start

```bash
git clone <repo-url> && cd skill-hub
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Usage

Place skill folders inside `.claude/skills/` at the project root. Each skill needs a `SKILL.md` file with YAML frontmatter:

```
.claude/skills/
└── my-skill/
    ├── SKILL.md          # Required — frontmatter + instructions
    ├── scripts/          # Optional — executable files
    ├── references/       # Optional — supplementary docs
    └── assets/           # Optional — images, data files
```

**SKILL.md format:**

```markdown
---
name: my-skill
description: What this skill does
license: MIT
---

# My Skill

Instructions and documentation go here.
```

Skills appear in the sidebar automatically. Click one to see its parsed frontmatter, rendered markdown, file tree, and syntax-highlighted file contents.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── lib/skills.ts              # Skill parsing and file serving
├── pages/
│   ├── index.astro            # Shell page
│   └── api/
│       ├── skills.ts          # GET /api/skills
│       └── skills/[name]/
│           ├── index.ts       # GET /api/skills/:name
│           └── files/[...path].ts  # GET /api/skills/:name/files/*
└── components/
    ├── SkillBrowser.vue       # Main layout and state
    ├── SkillList.vue          # Sidebar skill list
    ├── SkillDetail.vue        # Frontmatter card + markdown
    ├── FileTree.vue           # Recursive file tree
    ├── FileTreeNode.vue       # Individual tree node
    └── FileViewer.vue         # Syntax-highlighted file viewer
```

## Tech Stack

Astro SSR, Vue 3, gray-matter, markdown-it, shiki.
