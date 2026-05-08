import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolveApiKey } from "../config";

describe("resolveApiKey", () => {
  const originalEnv = process.env.CHANCEVISION_API_KEY;

  beforeEach(() => {
    delete process.env.CHANCEVISION_API_KEY;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.CHANCEVISION_API_KEY = originalEnv;
    } else {
      delete process.env.CHANCEVISION_API_KEY;
    }
  });

  it("returns the override when provided", () => {
    expect(resolveApiKey("sk-override")).toBe("sk-override");
  });

  it("returns the env var when no override is given", () => {
    process.env.CHANCEVISION_API_KEY = "sk-from-env";
    expect(resolveApiKey()).toBe("sk-from-env");
  });

  it("returns undefined when neither override nor env var is set", () => {
    expect(resolveApiKey()).toBeUndefined();
  });

  it("prefers override over env var", () => {
    process.env.CHANCEVISION_API_KEY = "sk-from-env";
    expect(resolveApiKey("sk-override")).toBe("sk-override");
  });

  it("returns undefined when override is empty string", () => {
    expect(resolveApiKey("")).toBeUndefined();
  });
});
