import { describe, it, expect } from "vitest";
import { parseSSE } from "../stream";
import type { ChatChunk } from "../types";

function createMockStream(chunks: string[]): ReadableStream<Uint8Array> {
  let index = 0;
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(encoder.encode(chunks[index]));
        index++;
      } else {
        controller.close();
      }
    },
  });
}

async function collectChunks(stream: ReadableStream<Uint8Array>): Promise<ChatChunk[]> {
  const results: ChatChunk[] = [];
  for await (const chunk of parseSSE(stream)) {
    results.push(chunk);
  }
  return results;
}

describe("parseSSE", () => {
  const sampleChunk: ChatChunk = {
    id: "chatcmpl-123",
    object: "chat.completion.chunk",
    created: 1778236980,
    model: "chance/chance-vision-1.5",
    choices: [
      {
        index: 0,
        delta: { content: "Hello", role: "assistant" },
        finish_reason: null,
      },
    ],
  };

  it("parses a single data line", async () => {
    const stream = createMockStream([`data: ${JSON.stringify(sampleChunk)}\n\n`]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("chatcmpl-123");
    expect(results[0].choices[0].delta.content).toBe("Hello");
  });

  it("parses multiple data lines", async () => {
    const chunk1 = { ...sampleChunk, id: "1" };
    const chunk2 = { ...sampleChunk, id: "2" };
    const chunk3 = { ...sampleChunk, id: "3" };

    const stream = createMockStream([
      `data: ${JSON.stringify(chunk1)}\n\n`,
      `data: ${JSON.stringify(chunk2)}\n\n`,
      `data: ${JSON.stringify(chunk3)}\n\n`,
    ]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(3);
    expect(results[0].id).toBe("1");
    expect(results[1].id).toBe("2");
    expect(results[2].id).toBe("3");
  });

  it("stops on [DONE] signal", async () => {
    const stream = createMockStream([
      `data: ${JSON.stringify(sampleChunk)}\n\n`,
      "data: [DONE]\n\n",
      `data: ${JSON.stringify(sampleChunk)}\n\n`, // should be ignored
    ]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(1);
  });

  it("skips empty lines", async () => {
    const stream = createMockStream(["\n", `data: ${JSON.stringify(sampleChunk)}\n\n`, "\n"]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(1);
  });

  it("skips comment lines (starting with colon)", async () => {
    const stream = createMockStream([
      ": this is a comment\n",
      `data: ${JSON.stringify(sampleChunk)}\n\n`,
    ]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(1);
  });

  it("skips unparseable data lines", async () => {
    const stream = createMockStream([
      "data: not-valid-json\n\n",
      `data: ${JSON.stringify(sampleChunk)}\n\n`,
    ]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("chatcmpl-123");
  });

  it("handles chunks split across multiple reads", async () => {
    const json = JSON.stringify(sampleChunk);
    const half = Math.floor(`data: ${json}\n\n`.length / 2);

    const full = `data: ${json}\n\n`;
    const part1 = full.slice(0, half);
    const part2 = full.slice(half);

    const stream = createMockStream([part1, part2]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("chatcmpl-123");
  });

  it("handles an empty stream", async () => {
    const stream = createMockStream([]);
    const results = await collectChunks(stream);
    expect(results).toHaveLength(0);
  });

  it("handles data: line without colon properly", async () => {
    const stream = createMockStream([`data:${JSON.stringify(sampleChunk)}\n\n`]);

    const results = await collectChunks(stream);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("chatcmpl-123");
  });
});
