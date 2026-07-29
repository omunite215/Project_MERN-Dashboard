import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);

describe("cors", () => {
  it("reflects an allowed origin with credentials", async () => {
    const res = await request(makeApp()).get("/health").set("Origin", "http://localhost:3000");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});
