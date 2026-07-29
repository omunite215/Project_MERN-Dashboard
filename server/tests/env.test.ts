import { describe, it, expect } from "bun:test";
import { parseEnv } from "../src/config/env.js";

describe("parseEnv", () => {
  it("parses valid env and coerces PORT to a number", () => {
    const env = parseEnv({
      NODE_ENV: "test",
      PORT: "5001",
      MONGODB_URL: "mongodb://localhost:27017/db",
    } as NodeJS.ProcessEnv);
    expect(env.PORT).toBe(5001);
    expect(env.MONGODB_URL).toBe("mongodb://localhost:27017/db");
    expect(env.CLIENT_ORIGIN).toBe("http://localhost:3000"); // default
  });

  it("throws when MONGODB_URL is missing", () => {
    expect(() => parseEnv({ NODE_ENV: "test" } as NodeJS.ProcessEnv)).toThrow(
      /MONGODB_URL/
    );
  });
});
