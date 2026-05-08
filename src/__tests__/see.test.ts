import { describe, it, expect } from "vitest";
import { buildMessages, buildRequestBody, isURL, fileToDataUrl } from "../commands/see";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("isURL", () => {
  it("returns true for http URLs", () => {
    expect(isURL("http://example.com/img.png")).toBe(true);
  });

  it("returns true for https URLs", () => {
    expect(isURL("https://example.com/img.png")).toBe(true);
  });

  it("returns false for local file paths", () => {
    expect(isURL("/Users/me/photo.png")).toBe(false);
  });

  it("returns false for relative file paths", () => {
    expect(isURL("./photo.png")).toBe(false);
  });

  it("returns false for data URLs", () => {
    expect(isURL("data:image/png;base64,abc123")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isURL("HTTPS://example.com/img.png")).toBe(true);
  });
});

describe("fileToDataUrl", () => {
  it("converts a PNG file to base64 data URL", () => {
    const tmpFile = join(tmpdir(), "chancevision-test.png");
    const data = Buffer.from([0x89, 0x50, 0x4e, 0x47]); // PNG header bytes
    writeFileSync(tmpFile, data);

    const dataUrl = fileToDataUrl(tmpFile);
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);

    unlinkSync(tmpFile);
  });

  it("converts a JPEG file to base64 data URL", () => {
    const tmpFile = join(tmpdir(), "chancevision-test.jpg");
    writeFileSync(tmpFile, Buffer.from("jpeg-data"));

    const dataUrl = fileToDataUrl(tmpFile);
    expect(dataUrl).toMatch(/^data:image\/jpeg;base64,/);

    unlinkSync(tmpFile);
  });

  it("uses fallback MIME for unknown extensions", () => {
    const tmpFile = join(tmpdir(), "chancevision-test.xyz");
    writeFileSync(tmpFile, Buffer.from("data"));

    const dataUrl = fileToDataUrl(tmpFile);
    expect(dataUrl).toMatch(/^data:application\/octet-stream;base64,/);

    unlinkSync(tmpFile);
  });

  it("encodes content correctly as base64", () => {
    const tmpFile = join(tmpdir(), "chancevision-test.png");
    writeFileSync(tmpFile, Buffer.from("hello"));

    const dataUrl = fileToDataUrl(tmpFile);
    const expected = `data:image/png;base64,${Buffer.from("hello").toString("base64")}`;
    expect(dataUrl).toBe(expected);

    unlinkSync(tmpFile);
  });
});

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

  it("accepts base64 data URLs", () => {
    const dataUrl = "data:image/png;base64,iVBORw0K";
    const messages = buildMessages(dataUrl);
    const content = messages[0].content as Array<any>;

    const imagePart = content.find((p: any) => p.type === "image_url");
    expect(imagePart).toBeDefined();
    expect(imagePart.image_url.url).toBe(dataUrl);
  });
});

describe("buildRequestBody", () => {
  const defaultModel = "chance/chance-vision-1.5";
  const baseOpts = { image: "https://example.com/img.png" };

  it("returns a minimal body with only required fields", () => {
    const body = buildRequestBody(baseOpts.image, baseOpts);

    expect(body.model).toBe(defaultModel);
    expect(body.messages).toHaveLength(1);
    expect(body.stream).toBeUndefined();
    expect(body.output_format).toBeUndefined();
  });

  it("includes stream when set to true", () => {
    const body = buildRequestBody(baseOpts.image, {
      ...baseOpts,
      stream: true,
    });

    expect(body.stream).toBe(true);
  });

  it("includes stream when set to false", () => {
    const body = buildRequestBody(baseOpts.image, {
      ...baseOpts,
      stream: false,
    });

    expect(body.stream).toBe(false);
  });

  it("omits stream when undefined", () => {
    const body = buildRequestBody(baseOpts.image, baseOpts);

    expect(body.stream).toBeUndefined();
  });

  it("includes output_format when provided", () => {
    const body = buildRequestBody(baseOpts.image, {
      ...baseOpts,
      outputFormat: "ui_component",
    });

    expect(body.output_format).toBe("ui_component");
  });

  it("includes both stream and output_format together", () => {
    const body = buildRequestBody(baseOpts.image, {
      ...baseOpts,
      stream: true,
      outputFormat: "ui_component",
    });

    expect(body.stream).toBe(true);
    expect(body.output_format).toBe("ui_component");
  });

  it("passes the image URL into the messages", () => {
    const image = "data:image/png;base64,abc123";
    const body = buildRequestBody(image, baseOpts);

    const content = body.messages[0].content as Array<any>;
    const imagePart = content.find((p: any) => p.type === "image_url");
    expect(imagePart.image_url.url).toBe(image);
  });
});
