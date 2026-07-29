import { describe, it, expect } from "bun:test";
import express from "express";
import request from "supertest";
import { authenticate } from "../src/middlewares/authenticate.js";
import { authorize } from "../src/middlewares/authorize.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { signAccessToken } from "../src/utils/tokens.js";

function app() {
  const a = express();
  a.get("/me", authenticate, (req, res) => res.json({ id: req.user!.id, role: req.user!.role }));
  a.get("/admin", authenticate, authorize("admin", "superadmin"), (_req, res) => res.json({ ok: true }));
  a.use(errorHandler);
  return a;
}
const bearer = async (role: string) => `Bearer ${await signAccessToken({ sub: "u1", role, tokenVersion: 0 })}`;

describe("auth middleware", () => {
  it("401 without a token", async () => {
    expect((await request(app()).get("/me")).status).toBe(401);
  });
  it("200 + req.user with a valid token", async () => {
    const res = await request(app()).get("/me").set("Authorization", await bearer("user"));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "u1", role: "user" });
  });
  it("403 when role not allowed", async () => {
    expect((await request(app()).get("/admin").set("Authorization", await bearer("user"))).status).toBe(403);
  });
  it("200 when role allowed", async () => {
    expect((await request(app()).get("/admin").set("Authorization", await bearer("admin"))).status).toBe(200);
  });
});
