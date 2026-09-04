## Default Agent Workflow

This repository uses the following default workflow for non-trivial work. Agents (Cursor, Codex, Claude Code, etc.) MUST follow it unless the user explicitly overrides it.

### Pipeline

1. **grill-me** — Before designing or coding, aggressively clarify goals, constraints, edge cases, and decisions. Prefer `/grill-me` (or the `grill-me` skill). Do not skip this for ambiguous feature/product work.
2. **superpowers** — After requirements are clear enough, follow Superpowers end-to-end:
   - `using-superpowers` first (discover and invoke relevant skills before acting)
   - `brainstorming` → design/spec approval
   - `writing-plans` → executable plan
   - `test-driven-development` + `subagent-driven-development` / `executing-plans` → implement
   - `verification-before-completion` before claiming done
3. **ponytail** — During implementation and review, force the laziest correct solution: YAGNI, reuse existing code, prefer stdlib/native over new deps, minimize diff and abstraction.

### Skill layout (multi-agent)

Skills are installed in-repo for Cursor / Codex / Claude Code compatibility:

| Path | Used by |
|------|---------|
| `.agents/skills/` | Cursor, Codex, and other agents that read the universal path |
| `.claude/skills/` | Claude Code |
| `skills-lock.json` | Lockfile for reproducible installs |

Reinstall / refresh from repo root:

```bash
npx skills add mattpocock/skills --skill grill-me -a cursor -a claude-code -a codex -y --copy
npx skills add DietrichGebert/ponytail --skill ponytail -a cursor -a claude-code -a codex -y --copy
npx skills add obra/superpowers --skill "*" -a cursor -a claude-code -a codex -y --copy
```

### When to skip

- Typo / one-line fix / pure docs: skip grill-me and the full Superpowers loop; still keep ponytail-level minimalism.
- User says "skip workflow" / "just do it": follow the user override.

---

