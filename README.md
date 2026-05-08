# ChanceVision CLI

[![npm version](https://img.shields.io/npm/v/@chancevision/cli?label=npm)](https://www.npmjs.com/package/@chancevision/cli)
[![CI](https://github.com/Chance-Inc/ChanceVision-CLI/actions/workflows/ci.yml/badge.svg)](https://github.com/Chance-Inc/ChanceVision-CLI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

CLI client for the [Chance Vision](https://chance.vision) platform. Analyze images with state-of-the-art vision AI, instantly.

## Install

```bash
# npm
npm install -g @chancevision/cli

# pnpm
pnpm add -g @chancevision/cli

# Run without installing
npx @chancevision/cli see --help
```

## Quick Start

```bash
# Set your API key
export CHANCEVISION_API_KEY="sk-..."

# Analyze an image
chancevision see -i https://example.com/photo.png

# Stream the response in real time
chancevision see -s -i https://example.com/photo.png
```

## Authentication

Pass your API key one of two ways:

```bash
# Option 1: Flag (takes priority)
chancevision see -k "sk-..." -i https://example.com/img.png

# Option 2: Environment variable (fallback)
export CHANCEVISION_API_KEY="sk-..."
chancevision see -i https://example.com/img.png
```

## Usage

```
chancevision see -i <image_url> [options]
```

Sends the prompt `"Let's see this"` with the image to the model (`chance/chance-vision-1.5`).

### Options

| Option                     | Default      | Description                                     |
| -------------------------- | ------------ | ----------------------------------------------- |
| `-i, --image <url>`        | _(required)_ | Image URL to analyze                            |
| `-k, --api-key <key>`      | —            | API key (or use `CHANCEVISION_API_KEY` env var) |
| `-s, --stream`             | `false`      | Stream the response as SSE chunks               |
| `--output-format <format>` | —            | Output format hint (e.g. `ui_component`)        |
| `-v, --verbose`            | `false`      | Show raw chunks and debug info on stderr        |

## Examples

### Basic image analysis

```bash
chancevision see -k "sk-..." -i https://images.chance.vision/image/revisit.png
```

### Streaming

```bash
chancevision see -s -i https://images.chance.vision/image/revisit.png
```

### Verbose streaming

```bash
chancevision see -s -v -i https://example.com/img.png
```

### Output format

```bash
chancevision see --output-format ui_component -i https://example.com/screenshot.png
```

## Build from Source

```bash
git clone https://github.com/anomalyco/chancevision-cli
cd chancevision-cli

pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Link globally for development
pnpm link --global
```

## Publish

```bash
# Bump version
npm version patch  # or minor / major

# Publish to npm (builds + typechecks via prepublishOnly hook)
npm publish
```

## API

This CLI is powered by the [Chance Vision API](https://chance.vision), a state‑of‑the‑art visual intelligence platform with streaming support and UI-component output.

`POST https://openapi.chance.vision/v1/chat/completions`

## License

[MIT](LICENSE)
