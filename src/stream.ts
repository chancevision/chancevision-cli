import type { ChatChunk } from "./types";

export async function* parseSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<ChatChunk> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(":")) continue;

        if (trimmed.startsWith("data:")) {
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") return;
          try {
            yield JSON.parse(data) as ChatChunk;
          } catch {
            // skip unparseable lines
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
