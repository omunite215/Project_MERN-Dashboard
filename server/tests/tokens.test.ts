import { describe, it, expect } from "bun:test";
import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from "../src/utils/tokens.js";

const payload = { sub: "abc", role: "admin", tokenVersion: 0 };

describe("tokens", () => {
  it("signs and verifies an access token round-trip", async () => {
    const decoded = await verifyAccessToken(await signAccessToken(payload));
    expect(decoded.sub).toBe("abc");
    expect(decoded.role).toBe("admin");
  });
  it("rejects an access token verified with the refresh key", async () => {
    await expect(verifyRefreshToken(await signAccessToken(payload))).rejects.toThrow();
  });
});
