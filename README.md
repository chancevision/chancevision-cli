# ChanceVision CLI

[![CI](https://github.com/chancevision/chancevision-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/chancevision/chancevision-cli/actions/workflows/ci.yml)
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

# Analyze an image from a URL or local file
chancevision see https://example.com/photo.png
chancevision see ~/Pictures/screenshot.png

# Stream the response in real time
chancevision see -s https://example.com/photo.png
```

## Authentication

Pass your API key one of two ways:

```bash
# Option 1: Flag (takes priority)
chancevision see -k "sk-..." https://example.com/img.png

# Option 2: Environment variable (fallback)
export CHANCEVISION_API_KEY="sk-..."
chancevision see https://example.com/img.png
```

## Usage

```
chancevision see <image> [options]
```

Sends the image to the model (`chance/chance-vision-1.5`) for analysis.

### Options

| Option                     | Default      | Description                                     |
| -------------------------- | ------------ | ----------------------------------------------- |
| `<image>`                  | _(required)_ | Image URL or local file path to analyze         |
| `-k, --api-key <key>`      | —            | API key (or use `CHANCEVISION_API_KEY` env var) |
| `-s, --stream`             | `false`      | Stream the response as SSE chunks               |
| `--output-format <format>` | —            | Output format hint (e.g. `ui_component`)        |
| `-v, --verbose`            | `false`      | Show raw chunks and debug info on stderr        |

## Examples

### Basic image analysis

```bash
# From a URL
chancevision see -k "sk-..." https://images.chance.vision/image/revisit.png

# From a local file
chancevision see ~/Pictures/screenshot.png
```

### Streaming

```bash
chancevision see -s https://images.chance.vision/image/revisit.png
```

### Verbose streaming

```bash
chancevision see -s -v https://example.com/img.png
```

### Output format

```bash
chancevision see --output-format ui_component https://example.com/screenshot.png
```

## Build from Source

```bash
git clone https://github.com/chancevision/chancevision-cli
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

### npmjs.org

```bash
npm publish --access public --otp=<code>
```

### GitHub Packages

```bash
npm login --registry=https://npm.pkg.github.com
npm publish
```

## API

This CLI is powered by the [Chance Vision API](https://chance.vision), a state‑of‑the‑art visual intelligence platform with streaming support and UI-component output.

`POST https://openapi.chance.vision/v1/chat/completions`

## License

[MIT](LICENSE)
