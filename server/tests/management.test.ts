import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import mongoose from "mongoose";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import { signAccessToken } from "../src/utils/tokens.js";
import User from "../src/models/User.js";

let token: string;

beforeAll(async () => {
  await connectTestDB();
  token = await signAccessToken({ sub: "u1", role: "user", tokenVersion: 0 });
});
afterAll(closeTestDB);
beforeEach(async () => { await User.deleteMany({}); });

describe("GET /management/admins", () => {
  it("returns only admins without passwords", async () => {
    await User.create({ name: "A", email: "a@x.co", password: "secret", role: "admin" });
    await User.create({ name: "U", email: "u@x.co", password: "secret", role: "user" });
    const res = await request(makeApp()).get("/management/admins").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].password).toBeUndefined();
  });
});

describe("GET /management/performance/:id", () => {
  it("400s on an invalid id", async () => {
    const res = await request(makeApp()).get("/management/performance/bad").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
  it("404s when the user does not exist", async () => {
    const res = await request(makeApp()).get(`/management/performance/${new mongoose.Types.ObjectId()}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
  it("200s with empty sales (and no password) when the user exists but has no affiliate stats", async () => {
    const user = await User.create({ name: "Solo", email: "solo@x.co", password: "secret12" });
    const res = await request(makeApp()).get(`/management/performance/${user._id}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.sales).toEqual([]);
    expect(res.body.user.password).toBeUndefined();
  });
});
