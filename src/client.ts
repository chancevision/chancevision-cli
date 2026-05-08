import { ofetch } from "ofetch";
import type { ChatRequest, ChatCompletionResponse } from "./types";

const BASE_URL = "https://openapi.chance.vision";

export function createClient(apiKey: string) {
  const fetch = ofetch.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return {
    async chatCompletions(body: ChatRequest): Promise<ChatCompletionResponse> {
      return fetch<ChatCompletionResponse>("/v1/chat/completions", {
        method: "POST",
        body,
      });
    },

    async chatCompletionsStream(body: ChatRequest): Promise<ReadableStream<Uint8Array>> {
      return fetch("/v1/chat/completions", {
        method: "POST",
        body: { ...body, stream: true },
        responseType: "stream",
      });
    },
  };
}
