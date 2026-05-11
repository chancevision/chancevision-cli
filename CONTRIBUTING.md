# Contributing to ChanceVision CLI

Thanks for helping improve ChanceVision CLI. Small fixes, docs improvements, examples, and feature ideas are all welcome.

## Getting Started

```bash
git clone https://github.com/chancevision/chancevision-cli
cd chancevision-cli
pnpm install
```

Useful commands:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
```

To try your local build globally:

```bash
pnpm build
pnpm link --global
chancevision --help
```

## Pull Requests

Before opening a pull request, please run:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Keep pull requests focused. If a change affects user-facing behavior, update the README or examples. If you add behavior, add or update tests near the changed code.

## Good First Contributions

- Add more real-world examples to the README.
- Improve error messages.
- Add stdin support for image URLs or file paths.
- Add shell completion docs.
- Add tests for edge cases in streaming and file handling.

## Commit Style

This project uses conventional commits where possible:

```text
feat: add shell completion docs
fix: redact local image data in verbose logs
docs: add screenshot analysis example
```

## Reporting Issues

When reporting a bug, include:

- Your operating system.
- Node.js version.
- Package manager and version.
- The command you ran.
- Expected behavior.
- Actual behavior.

Do not include API keys or private images in public issues.
