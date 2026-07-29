import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import { signAccessToken } from "../src/utils/tokens.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);

describe("protected data routes", () => {
  it("401 without token on /client/customers", async () => {
    expect((await request(makeApp()).get("/client/customers")).status).toBe(401);
  });
  it("200 with a valid token", async () => {
    const token = await signAccessToken({ sub: "u1", role: "user", tokenVersion: 0 });
    const res = await request(makeApp()).get("/client/customers").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
  it("400 on invalid :id param", async () => {
    const token = await signAccessToken({ sub: "u1", role: "user", tokenVersion: 0 });
    const res = await request(makeApp()).get("/general/user/not-an-id").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});
