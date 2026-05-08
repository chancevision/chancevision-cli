export function resolveApiKey(override?: string): string | undefined {
  if (override) return override;
  return process.env.CHANCEVISION_API_KEY;
}
