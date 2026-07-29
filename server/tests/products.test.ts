import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import Product from "../src/models/Product.js";
import { signAccessToken } from "../src/utils/tokens.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(async () => { await Product.deleteMany({}); });

const tok = async (role: string) => `Bearer ${await signAccessToken({ sub: "u1", role, tokenVersion: 0 })}`;

describe("products CRUD", () => {
  it("GET requires auth", async () => {
    expect((await request(makeApp()).get("/products")).status).toBe(401);
  });
  it("create: 403 for user, 201 for admin", async () => {
    const body = { name: "Widget", price: 9.99, description: "d", category: "c", rating: 4, supply: 10 };
    expect((await request(makeApp()).post("/products").set("Authorization", await tok("user")).send(body)).status).toBe(403);
    const res = await request(makeApp()).post("/products").set("Authorization", await tok("admin")).send(body);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Widget");
  });
  it("create: 400 on invalid body", async () => {
    const res = await request(makeApp()).post("/products").set("Authorization", await tok("admin")).send({ name: "" });
    expect(res.status).toBe(400);
  });
  it("update + delete as admin", async () => {
    const created = await Product.create({ name: "X", price: 1, category: "c", supply: 1, rating: 1, description: "d" });
    const id = String(created._id);
    const upd = await request(makeApp()).patch(`/products/${id}`).set("Authorization", await tok("admin")).send({ price: 2 });
    expect(upd.status).toBe(200);
    expect(upd.body.price).toBe(2);
    const del = await request(makeApp()).delete(`/products/${id}`).set("Authorization", await tok("superadmin"));
    expect(del.status).toBe(200);
    expect(await Product.findById(id)).toBeNull();
  });
});
