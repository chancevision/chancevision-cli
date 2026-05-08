# Changelog

## [Unreleased]

- Support for local file paths (`-i ~/photo.png`) — auto-converts to base64 data URL

## [0.1.1] — 2026-05-08

- Migrated to scoped package name: `@chancevision/cli`
- Trusted Publishing via OIDC for CI/CD npm releases
- ESLint + Prettier + Husky pre-commit hooks
- GitHub Actions CI (lint, format, typecheck, test, build)
- Vitest test suite with coverage thresholds
- Minified production build

## [0.1.0] — 2026-05-08

- Initial release
- `chancevision see -i <image_url>` — analyze images with state‑of‑the‑art vision AI
- Streaming SSE output support (`-s, --stream`)
- API key authentication via `-k` flag or `CHANCEVISION_API_KEY` env var
- Verbose mode (`-v`) for debugging raw response chunks
- Output format hint (`--output-format`) for UI component generation
