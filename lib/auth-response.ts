const sensitiveKeys = new Set([
  "token",
  "access_token",
  "refresh_token",
]);

export function stripAuthTokens(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripAuthTokens);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !sensitiveKeys.has(key)).map(([key, entry]) => [key, stripAuthTokens(entry)]),
  );
}
