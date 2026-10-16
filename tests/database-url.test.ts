import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDatabaseUrl } from "../src/lib/database-url";

const baseUrl = "postgresql://owner:p%40ss%26word@db.example.com:5432/store";

test("legacy SSL aliases explicitly retain full certificate verification", () => {
  for (const mode of ["prefer", "require", "verify-ca"]) {
    const url = new URL(
      normalizeDatabaseUrl(`${baseUrl}?sslmode=${mode}&channel_binding=require`)
    );
    assert.equal(url.searchParams.get("sslmode"), "verify-full");
    assert.equal(url.searchParams.get("channel_binding"), "require");
    assert.equal(url.username, "owner");
    assert.equal(url.password, "p%40ss%26word");
    assert.equal(url.hostname, "db.example.com");
    assert.equal(url.port, "5432");
    assert.equal(url.pathname, "/store");
  }
});

test("explicit libpq compatibility is not overridden", () => {
  const url = `${baseUrl}?sslmode=require&uselibpqcompat=true`;
  assert.equal(normalizeDatabaseUrl(url), url);
});

test("other SSL settings and local database URLs remain unchanged", () => {
  for (const url of [
    baseUrl,
    "postgresql://localhost/store",
    `${baseUrl}?sslmode=verify-full`,
    `${baseUrl}?sslmode=disable`,
    `${baseUrl}?sslmode=no-verify`,
  ]) {
    assert.equal(normalizeDatabaseUrl(url), url);
  }
});

test("missing or malformed database URLs do not expose credentials in errors", () => {
  assert.throws(() => normalizeDatabaseUrl(undefined), /^Error: DATABASE_URL is required$/);
  assert.throws(
    () => normalizeDatabaseUrl("postgresql://owner:secret@[broken"),
    /^Error: DATABASE_URL must be a valid PostgreSQL URL$/
  );
});
