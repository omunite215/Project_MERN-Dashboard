import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import User from "../src/models/User.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(async () => { await User.deleteMany({}); });

describe("GET /management/admins", () => {
  it("returns only admins without passwords", async () => {
    await User.create({ name: "A", email: "a@x.co", password: "secret", role: "admin" });
    await User.create({ name: "U", email: "u@x.co", password: "secret", role: "user" });
    const res = await request(makeApp()).get("/management/admins");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].password).toBeUndefined();
  });
});

describe("GET /management/performance/:id", () => {
  it("400s on an invalid id", async () => {
    const res = await request(makeApp()).get("/management/performance/bad");
    expect(res.status).toBe(400);
  });
  it("404s when the user has no stats", async () => {
    const res = await request(makeApp()).get(`/management/performance/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});
