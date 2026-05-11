# ChanceVision CLI

[![CI](https://github.com/chancevision/chancevision-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/chancevision/chancevision-cli/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@chancevision/cli)](https://www.npmjs.com/package/@chancevision/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

![ChanceVision CLI banner](.github/assets/banner.png)

**Give your terminal, scripts, and agents eyes.**

ChanceVision CLI analyzes image URLs and local image files with the [Chance Vision](https://chance.vision) visual intelligence API. Use it to inspect screenshots, understand UI states, extract visual details, caption images, and give AI agents a simple command-line way to see.

```bash
npm install -g @chancevision/cli
export CHANCEVISION_API_KEY="sk-..."

chancevision see ./screenshot.png
```

## Why ChanceVision CLI?

- **Vision from the shell**: analyze local files or remote image URLs without opening a browser.
- **Agent-friendly by design**: any agent that supports tools, skills, or shell commands can install and call it.
- **Clean default output**: prints the model answer by default for easy reading and piping.
- **Two focused formats**: request `markdown` for readable reports or `ui_component` for structured UI output.
- **Streaming support**: use `--stream` when you want real-time output in interactive workflows.
- **Script-ready**: works with environment-based auth, file paths, URLs, and standard CLI output.

## Use Cases

| Use case          | Example command                                                            |
| ----------------- | -------------------------------------------------------------------------- |
| Screenshot review | `chancevision see ./app-screen.png`                                        |
| Markdown report   | `chancevision see --output-format markdown ./design.png`                   |
| UI component data | `chancevision see --output-format ui_component ./mockup.png`               |
| Remote image      | `chancevision see https://images.chance.vision/image/revisit.png`          |
| Live response     | `chancevision see --stream https://images.chance.vision/image/revisit.png` |

## Install

Requires Node.js 20 or newer.

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

## Quick Start

> **Get your API key** → [platform.chance.vision](https://platform.chance.vision/)

```bash
export CHANCEVISION_API_KEY="sk-..."

# Analyze an image from a URL
chancevision see https://example.com/photo.png

# Analyze a local file
chancevision see ~/Pictures/screenshot.png

# Stream the response in real time
chancevision see -s https://example.com/photo.png
```

## Agent-Ready

ChanceVision CLI works well inside local agent tools that can run shell commands, including [OpenClaw](https://github.com/bigcode-project/openclaw), [Hermes](https://github.com/NousResearch/hermes-agent), [Codex](https://github.com/openai/codex), [Claude Code](https://code.claude.com/), and similar agents.

Give your agent this install prompt:

```text
Install ChanceVision CLI so you can analyze screenshots and image files from the terminal.

Steps:
1. Check that Node.js 20+ is available.
2. Install the CLI globally:
   npm install -g @chancevision/cli
3. Verify the install:
   chancevision --help
4. Use the existing CHANCEVISION_API_KEY environment variable if present.
5. Do not print, log, or commit API keys.
6. When asked to inspect an image, run:
   chancevision see <image-path-or-url>
7. For markdown output, run:
   chancevision see --output-format markdown <image-path-or-url>
8. For structured UI output, run:
   chancevision see --output-format ui_component <image-path-or-url>
```

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
| `-k, --api-key <key>`      | -            | API key (or use `CHANCEVISION_API_KEY` env var) |
| `-s, --stream`             | `false`      | Stream the response as SSE chunks               |
| `--output-format <format>` | `markdown`   | Output format: `markdown` or `ui_component`     |
| `--json`                   | `false`      | Print the raw JSON API response                 |
| `-v, --verbose`            | `false`      | Show redacted request details and raw chunks    |

## Development

```bash
git clone https://github.com/chancevision/chancevision-cli
cd chancevision-cli
pnpm install

# Run checks
pnpm lint
pnpm typecheck
pnpm test

# Build
pnpm build
```

To try your local build globally:

```bash
pnpm link --global
chancevision --help
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## API

This CLI is powered by the [Chance Vision API](https://chance.vision), a visual intelligence platform with streaming support and UI-component output.

`POST https://openapi.chance.vision/v1/chat/completions`

## License

[MIT](LICENSE)
