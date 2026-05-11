import { Command } from "commander";
import chalk from "chalk";
import { readFileSync, existsSync } from "node:fs";
import { extname } from "node:path";
import { createClient } from "../client";
import { parseSSE } from "../stream";
import { resolveApiKey } from "../config";
import type { ChatRequest, ContentPart, Message } from "../types";

const DEFAULT_MODEL = "chance/chance-vision-1.5";
const PROMPT = "Let's see this";
const OUTPUT_FORMATS = ["markdown", "ui_component"] as const;

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
  stream?: boolean;
  outputFormat?: OutputFormat;
  json?: boolean;
  verbose?: boolean;
}

type OutputFormat = (typeof OUTPUT_FORMATS)[number];

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
    { type: "text", text: PROMPT },
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

export function getResponseContent(response: {
  choices?: { message?: { content?: string } }[];
}): string {
  return response.choices?.[0]?.message?.content ?? "";
}

export function redactRequestBody(body: ChatRequest): ChatRequest {
  return {
    ...body,
    messages: body.messages.map((message) => {
      if (!Array.isArray(message.content)) return message;

      return {
        ...message,
        content: message.content.map((part) => {
          if (part.type !== "image_url") return part;

          const url = part.image_url.url;
          if (!url.startsWith("data:")) return part;

          const [header = "data:application/octet-stream;base64", payload = ""] = url.split(",", 2);
          const mime = header.slice("data:".length).replace(";base64", "");

          return {
            ...part,
            image_url: {
              url: `data:${mime};base64,[redacted ${payload.length} base64 chars]`,
            },
          };
        }),
      };
    }),
  };
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
    .argument("<image>", "Image URL or local file path to analyze")
    .option("-k, --api-key <key>", "API key (or set CHANCEVISION_API_KEY env var)")
    .option("-s, --stream", "Stream the response as SSE chunks")
    .option("--output-format <format>", "Output format (markdown or ui_component)")
    .option("--json", "Print the raw JSON response")
    .option("-v, --verbose", "Show raw chunks and debug info")
    .action(async (image: string, opts: SeeOptions) => {
      const apiKey = resolveApiKey(apiKeyOverride ?? opts.apiKey);

      if (!apiKey) {
        console.error(chalk.red("Error: No API key provided."));
        console.error("  Set the CHANCEVISION_API_KEY environment variable or pass --api-key.");
        process.exit(1);
      }

      if (opts.outputFormat && !isOutputFormat(opts.outputFormat)) {
        console.error(chalk.red(`Error: Unsupported output format — ${opts.outputFormat}`));
        console.error(`  Available formats: ${OUTPUT_FORMATS.join(", ")}`);
        process.exit(1);
      }

      const imageUrl = isURL(image) ? image : fileToDataUrl(image);
      const body = buildRequestBody(imageUrl, opts);

      if (opts.verbose) {
        process.stderr.write(
          chalk.dim("Request body:\n" + JSON.stringify(redactRequestBody(body), null, 2) + "\n\n"),
        );
      }

      const client = createClient(apiKey);

      if (opts.stream) {
        await handleStream(client, body, opts);
      } else {
        try {
          const response = await client.chatCompletions(body);
          if (opts.json) {
            console.log(JSON.stringify(response, null, 2));
          } else {
            console.log(getResponseContent(response));
          }
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

function isOutputFormat(format: string): format is OutputFormat {
  return (OUTPUT_FORMATS as readonly string[]).includes(format);
}
/* v8 ignore stop */
