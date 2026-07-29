import { describe, it, expect } from "bun:test";
import { parseEnv } from "../src/config/env.js";

describe("parseEnv", () => {
  it("parses valid env and coerces PORT to a number", () => {
    const env = parseEnv({
      NODE_ENV: "test",
      PORT: "5001",
      MONGODB_URL: "mongodb://localhost:27017/db",
      JWT_ACCESS_SECRET: "a",
      JWT_REFRESH_SECRET: "b",
    } as NodeJS.ProcessEnv);
    expect(env.PORT).toBe(5001);
    expect(env.MONGODB_URL).toBe("mongodb://localhost:27017/db");
    expect(env.CLIENT_ORIGIN).toEqual(["http://localhost:3000"]); // default → array
  });

  it("throws when MONGODB_URL is missing", () => {
    expect(() => parseEnv({ NODE_ENV: "test" } as NodeJS.ProcessEnv)).toThrow(
      /MONGODB_URL/
    );
  });

  it("parses CLIENT_ORIGIN csv into an array and coerces booleans", () => {
    const env = parseEnv({
      NODE_ENV: "test",
      MONGODB_URL: "mongodb://x/db",
      JWT_ACCESS_SECRET: "a",
      JWT_REFRESH_SECRET: "b",
      CLIENT_ORIGIN: "http://localhost:3000, https://app.example.com",
      COOKIE_SECURE: "true",
      COOKIE_SAMESITE: "none",
    } as NodeJS.ProcessEnv);
    expect(env.CLIENT_ORIGIN).toEqual([
      "http://localhost:3000",
      "https://app.example.com",
    ]);
    expect(env.COOKIE_SECURE).toBe(true);
    expect(env.COOKIE_SAMESITE).toBe("none");
  });

  it('parses COOKIE_SECURE "false" as boolean false', () => {
    const env = parseEnv({
      NODE_ENV: "test",
      MONGODB_URL: "mongodb://x/db",
      JWT_ACCESS_SECRET: "a",
      JWT_REFRESH_SECRET: "b",
      COOKIE_SECURE: "false",
    } as NodeJS.ProcessEnv);
    expect(env.COOKIE_SECURE).toBe(false);
  });

  it("requires JWT secrets", () => {
    expect(() =>
      parseEnv({ NODE_ENV: "test", MONGODB_URL: "mongodb://x/db" } as NodeJS.ProcessEnv)
    ).toThrow(/JWT_ACCESS_SECRET/);
  });
});
