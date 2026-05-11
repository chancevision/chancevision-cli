# ChanceVision CLI

[![CI](https://github.com/chancevision/chancevision-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/chancevision/chancevision-cli/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@chancevision/cli)](https://www.npmjs.com/package/@chancevision/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

![ChanceVision CLI banner](.github/assets/banner.png)

Analyze images from your terminal with the [Chance Vision](https://chance.vision) visual intelligence API.

Use it for screenshot QA, UI understanding, OCR-style extraction, image captioning, and quick visual checks inside shell scripts.

## Install

```bash
# npm
npm install -g @chancevision/cli

# pnpm
pnpm add -g @chancevision/cli

# yarn
yarn global add @chancevision/cli

# bun
bun add -g @chancevision/cli

# Run without installing
npx @chancevision/cli see --help
```

Requires Node.js 20 or newer.

## Quick Start

Get an API key at [chance.vision](https://chance.vision), then:

```bash
export CHANCEVISION_API_KEY="sk-..."

# Describe an image from a URL
chancevision see https://example.com/photo.png

# Analyze a local file
chancevision see ~/Pictures/screenshot.png

# Stream the response in real time
chancevision see -s https://example.com/photo.png
```

Example output:

```text
The image shows a dashboard with three summary cards, a revenue chart, and a table of recent orders. The main accessibility issue is low contrast in the secondary labels.
```

## Why ChanceVision CLI?

- **Fast terminal workflow**: inspect screenshots, product images, and documents without leaving your shell.
- **Useful defaults**: prints the model answer by default, with `--json` for raw API responses.
- **Focused output formats**: request `markdown` or `ui_component` when you need a specific response shape.
- **Streaming support**: use `--stream` for real-time output in interactive workflows.
- **Script-friendly**: supports remote URLs, local files, environment-based auth, and raw JSON output.

## Authentication

```bash
# Option 1: Flag, useful for one-off commands
chancevision see -k "sk-..." https://example.com/img.png

# Option 2: Environment variable, recommended for daily use
export CHANCEVISION_API_KEY="sk-..."
chancevision see https://example.com/img.png
```

## Usage

```text
chancevision see <image> [options]
```

Sends the image to the model (`chance/chance-vision-1.5`) for analysis.

### Options

| Option                     | Default      | Description                                     |
| -------------------------- | ------------ | ----------------------------------------------- |
| `<image>`                  | _(required)_ | Image URL or local file path to analyze         |
| `-k, --api-key <key>`      | —            | API key (or use `CHANCEVISION_API_KEY` env var) |
| `-s, --stream`             | `false`      | Stream the response as SSE chunks               |
| `--output-format <format>` | —            | Output format: `markdown` or `ui_component`     |
| `--json`                   | `false`      | Print the raw JSON API response                 |
| `-v, --verbose`            | `false`      | Show redacted request details and raw chunks    |

## Examples

### Basic image analysis

```bash
chancevision see https://images.chance.vision/image/revisit.png
chancevision see ~/Pictures/screenshot.png
```

### Streaming

```bash
chancevision see -s https://images.chance.vision/image/revisit.png
```

### Raw JSON

```bash
chancevision see --json https://example.com/screenshot.png
```

### Output format

```bash
chancevision see --output-format markdown https://example.com/screenshot.png
chancevision see --output-format ui_component https://example.com/screenshot.png
```

## Development

```bash
git clone https://github.com/chancevision/chancevision-cli
cd chancevision-cli

pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Link globally for local development
pnpm link --global
```

Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## API

This CLI is powered by the [Chance Vision API](https://chance.vision), a visual intelligence platform with streaming support and UI-component output.

`POST https://openapi.chance.vision/v1/chat/completions`

## License

[MIT](LICENSE)
