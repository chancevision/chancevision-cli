import { Command } from "commander";
import chalk from "chalk";
import { readFileSync, existsSync } from "node:fs";
import { extname } from "node:path";
import { createClient } from "../client";
import { parseSSE } from "../stream";
import { resolveApiKey } from "../config";
import type { ChatRequest, ContentPart, Message } from "../types";

const DEFAULT_MODEL = "chance/chance-vision-1.5";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
};

interface SeeOptions {
  apiKey?: string;
  image: string;
  stream?: boolean;
  outputFormat?: string;
  verbose?: boolean;
}

export function isURL(str: string): boolean {
  return /^https?:\/\//i.test(str);
}

export function fileToDataUrl(filePath: string): string {
  if (!existsSync(filePath)) {
    console.error(chalk.red(`Error: File not found — ${filePath}`));
    process.exit(1);
  }

  const data = readFileSync(filePath);
  const ext = extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] ?? "application/octet-stream";

  return `data:${mime};base64,${data.toString("base64")}`;
}

export function buildMessages(image: string): Message[] {
  const content: ContentPart[] = [
    { type: "text", text: "Let's see this" },
    { type: "image_url", image_url: { url: image } },
  ];

  return [{ role: "user", content }];
}

export function buildRequestBody(image: string, opts: SeeOptions): ChatRequest {
  const body: ChatRequest = {
    model: DEFAULT_MODEL,
    messages: buildMessages(image),
  };

  if (opts.stream !== undefined) body.stream = opts.stream;
  if (opts.outputFormat) body.output_format = opts.outputFormat;

  return body;
}

/* v8 ignore start */
async function handleStream(
  client: ReturnType<typeof createClient>,
  body: ChatRequest,
  opts: SeeOptions,
) {
  let fullContent = "";
  try {
    const stream = await client.chatCompletionsStream(body);

    for await (const chunk of parseSSE(stream)) {
      if (opts.verbose) {
        process.stderr.write(chalk.dim(JSON.stringify(chunk)) + "\n");
      }
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        fullContent += delta;
        process.stdout.write(delta);
      }
    }

    process.stdout.write("\n");
    if (opts.verbose) {
      process.stderr.write(chalk.dim(`[Total tokens received: ${fullContent.length} chars]\n`));
    }
  } catch (err: any) {
    console.error(chalk.red(`Request failed: ${err.message || err}`));
    if (err.data) {
      console.error(chalk.dim(JSON.stringify(err.data, null, 2)));
    }
    process.exit(1);
  }
}

export function seeCommand(apiKeyOverride?: string) {
  return new Command("see")
    .description("Seamless visual intelligence. Analyze any image with state‑of‑the‑art vision AI.")
    .requiredOption("-i, --image <url|path>", "Image URL or local file path to analyze")
    .option("-k, --api-key <key>", "API key (or set CHANCEVISION_API_KEY env var)")
    .option("-s, --stream", "Stream the response as SSE chunks")
    .option("--output-format <format>", "Output format hint (e.g. ui_component)")
    .option("-v, --verbose", "Show raw chunks and debug info")
    .action(async (opts: SeeOptions) => {
      const apiKey = resolveApiKey(apiKeyOverride ?? opts.apiKey);

      if (!apiKey) {
        console.error(chalk.red("Error: No API key provided."));
        console.error("  Set the CHANCEVISION_API_KEY environment variable or pass --api-key.");
        process.exit(1);
      }

      const imageUrl = isURL(opts.image) ? opts.image : fileToDataUrl(opts.image);
      const body = buildRequestBody(imageUrl, opts);

      if (opts.verbose) {
        process.stderr.write(chalk.dim("Request body:\n" + JSON.stringify(body, null, 2) + "\n\n"));
      }

      const client = createClient(apiKey);

      if (opts.stream) {
        await handleStream(client, body, opts);
      } else {
        try {
          const response = await client.chatCompletions(body);
          console.log(JSON.stringify(response, null, 2));
        } catch (err: any) {
          console.error(chalk.red(`Request failed: ${err.message || err}`));
          if (err.data) {
            console.error(chalk.dim(JSON.stringify(err.data, null, 2)));
          }
          process.exit(1);
        }
      }
    });
}
/* v8 ignore stop */
