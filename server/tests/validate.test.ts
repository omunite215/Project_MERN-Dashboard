import { describe, it, expect } from "bun:test";
import express from "express";
import request from "supertest";
import { z } from "zod";
import { validate } from "../src/middlewares/validate.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";

function app() {
  const a = express();
  a.use(express.json());
  a.post("/x", validate({ body: z.object({ n: z.number() }) }), (req, res) => res.json(req.body));
  a.use(errorHandler);
  return a;
}

describe("validate", () => {
  it("passes valid body through", async () => {
    const res = await request(app()).post("/x").send({ n: 5 });
    expect(res.status).toBe(200);
    expect(res.body.n).toBe(5);
  });
  it("400s invalid body with issues", async () => {
    const res = await request(app()).post("/x").send({ n: "nope" });
    expect(res.status).toBe(400);
    expect(res.body.issues?.length).toBeGreaterThan(0);
  });
});
