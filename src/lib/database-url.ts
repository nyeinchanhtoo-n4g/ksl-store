export function normalizeDatabaseUrl(connectionString: string | undefined): string {
  if (!connectionString) throw new Error("DATABASE_URL is required");

  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL URL");
  }

  const sslMode = url.searchParams.get("sslmode");
  if (
    url.searchParams.get("uselibpqcompat") !== "true" &&
    sslMode &&
    ["prefer", "require", "verify-ca"].includes(sslMode)
  ) {
    // Preserve pg 8's certificate and hostname verification after its SSL defaults change.
    url.searchParams.set("sslmode", "verify-full");
    return url.toString();
  }

  return connectionString;
}
