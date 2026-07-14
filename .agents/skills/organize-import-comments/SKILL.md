---
name: organize-import-comments
description: Organize TypeScript, TSX, JavaScript and JSX imports into the project's commented category blocks. Use when creating, editing, reviewing or formatting source files in this repository, especially when imports are added, removed or reordered.
---

# Organize import comments

Keep directives such as `"use client";` as the first statements in the file.

Group imports with one blank line between groups. Use `//* Libraries imports`, `//* Components imports`, `//* Hooks imports`, `//* Services imports`, `//* Constants imports`, `//* Utilities imports`, `//* Types imports`, and `//* Styles imports`. Include only categories present in the file.

Keep all `import type` declarations under `Types`. Put side-effect stylesheet imports under `Styles`. Treat React, Next.js, MUI and npm packages as libraries; aliases or local files under components as components; then classify hooks, services, constants, utilities and types by their source path.

After changing imports, run `node .agents/skills/organize-import-comments/scripts/organize-imports.mjs src` from the repository root. Run the project build afterward and fix any errors.
