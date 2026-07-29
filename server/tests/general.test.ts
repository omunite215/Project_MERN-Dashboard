import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import mongoose from "mongoose";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import User from "../src/models/User.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(async () => { await User.deleteMany({}); });

describe("GET /general/user/:id", () => {
  it("returns the user without password", async () => {
    const u = await User.create({ name: "U", email: "u@x.co", password: "secret", occupation: "Dev" });
    const res = await request(makeApp()).get(`/general/user/${u._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("U");
    expect(res.body.password).toBeUndefined();
  });

  it("404s when the user does not exist", async () => {
    const res = await request(makeApp()).get(`/general/user/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });

  it("400s on an invalid id", async () => {
    const res = await request(makeApp()).get("/general/user/not-an-id");
    expect(res.status).toBe(400);
  });
});
