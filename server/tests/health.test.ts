import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);

describe("app", () => {
  it("responds on /health", async () => {
    const res = await request(makeApp()).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
  it("404s unknown routes via notFound + errorHandler", async () => {
    const res = await request(makeApp()).get("/does-not-exist");
    expect(res.status).toBe(404);
  });
});
