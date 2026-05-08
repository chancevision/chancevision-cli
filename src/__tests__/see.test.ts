import { describe, it, expect } from "vitest";
import { buildMessages, buildRequestBody } from "../commands/see";

describe("buildMessages", () => {
  it("returns a single user message with text and image content", () => {
    const messages = buildMessages("https://example.com/img.png");

    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe("user");
    expect(Array.isArray(messages[0].content)).toBe(true);
  });

  it("includes the hardcoded prompt text", () => {
    const messages = buildMessages("https://example.com/img.png");
    const content = messages[0].content as Array<any>;

    const textPart = content.find((p: any) => p.type === "text");
    expect(textPart).toBeDefined();
    expect(textPart.text).toBe("Let's see this");
  });

  it("includes the image URL", () => {
    const url = "https://images.chance.vision/image/revisit.png";
    const messages = buildMessages(url);
    const content = messages[0].content as Array<any>;

    const imagePart = content.find((p: any) => p.type === "image_url");
    expect(imagePart).toBeDefined();
    expect(imagePart.image_url.url).toBe(url);
  });
});

describe("buildRequestBody", () => {
  const defaultModel = "chance/chance-vision-1.5";

  it("returns a minimal body with only required fields", () => {
    const body = buildRequestBody({ image: "https://example.com/img.png" });

    expect(body.model).toBe(defaultModel);
    expect(body.messages).toHaveLength(1);
    expect(body.stream).toBeUndefined();
    expect(body.output_format).toBeUndefined();
  });

  it("includes stream when set to true", () => {
    const body = buildRequestBody({
      image: "https://example.com/img.png",
      stream: true,
    });

    expect(body.stream).toBe(true);
  });

  it("includes stream when set to false", () => {
    const body = buildRequestBody({
      image: "https://example.com/img.png",
      stream: false,
    });

    expect(body.stream).toBe(false);
  });

  it("omits stream when undefined", () => {
    const body = buildRequestBody({ image: "https://example.com/img.png" });

    expect(body.stream).toBeUndefined();
  });

  it("includes output_format when provided", () => {
    const body = buildRequestBody({
      image: "https://example.com/img.png",
      outputFormat: "ui_component",
    });

    expect(body.output_format).toBe("ui_component");
  });

  it("includes both stream and output_format together", () => {
    const body = buildRequestBody({
      image: "https://example.com/img.png",
      stream: true,
      outputFormat: "ui_component",
    });

    expect(body.stream).toBe(true);
    expect(body.output_format).toBe("ui_component");
  });
});
