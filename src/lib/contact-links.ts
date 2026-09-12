export function buildTelegramUrl(baseUrl: string, message: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("text", message);
  return url.toString();
}

export function buildViberUrl(baseUrl: string, message: string) {
  const url = new URL(baseUrl);
  url.searchParams.set(url.protocol === "viber:" ? "text" : "draft", message);
  return url.toString();
}
