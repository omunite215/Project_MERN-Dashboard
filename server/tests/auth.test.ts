import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import User from "../src/models/User.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(async () => { await User.deleteMany({}); });

describe("auth", () => {
  it("registers, hashes, returns access token + user (no password), forces role user", async () => {
    const res = await request(makeApp()).post("/auth/register")
      .send({ name: "Al", email: "a@x.co", password: "secret12" });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.role).toBe("user");
    expect(res.headers["set-cookie"]?.[0]).toMatch(/refreshToken=/);
  });
  it("rejects duplicate email", async () => {
    const app = makeApp();
    await request(app).post("/auth/register").send({ name: "Al", email: "a@x.co", password: "secret12" });
    const res = await request(app).post("/auth/register").send({ name: "Bo", email: "a@x.co", password: "secret12" });
    expect(res.status).toBe(409);
  });
  it("400s invalid register body", async () => {
    const res = await request(makeApp()).post("/auth/register").send({ email: "bad", password: "x" });
    expect(res.status).toBe(400);
  });
  it("logs in with correct password, 401 on wrong", async () => {
    const app = makeApp();
    await request(app).post("/auth/register").send({ name: "Al", email: "a@x.co", password: "secret12" });
    expect((await request(app).post("/auth/login").send({ email: "a@x.co", password: "secret12" })).status).toBe(200);
    expect((await request(app).post("/auth/login").send({ email: "a@x.co", password: "nope" })).status).toBe(401);
  });
  it("refresh issues a new access token from the cookie; me returns the user", async () => {
    const app = makeApp();
    const reg = await request(app).post("/auth/register").send({ name: "Al", email: "a@x.co", password: "secret12" });
    const cookie = reg.headers["set-cookie"];
    const refreshed = await request(app).post("/auth/refresh").set("Cookie", cookie);
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.accessToken).toBeTruthy();
    const me = await request(app).get("/auth/me").set("Authorization", `Bearer ${refreshed.body.accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe("a@x.co");
  });
  it("me 401 without token", async () => {
    expect((await request(makeApp()).get("/auth/me")).status).toBe(401);
  });
  it("revokes refresh token on logout — POST /auth/refresh returns 401 after logout", async () => {
    const app = makeApp();
    const reg = await request(app).post("/auth/register").send({ name: "Al", email: "a@x.co", password: "secret12" });
    expect(reg.status).toBe(201);
    const cookie = reg.headers["set-cookie"];
    const logout = await request(app).post("/auth/logout").set("Cookie", cookie);
    expect(logout.status).toBe(204);
    const refresh = await request(app).post("/auth/refresh").set("Cookie", cookie);
    expect(refresh.status).toBe(401);
  });
});
