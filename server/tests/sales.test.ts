import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import OverallStat from "../src/models/OverallStat.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(async () => { await OverallStat.deleteMany({}); });

describe("GET /sales/sales", () => {
  it("404s when there are no overall stats", async () => {
    const res = await request(makeApp()).get("/sales/sales");
    expect(res.status).toBe(404);
  });
  it("returns the first overall stat document", async () => {
    await OverallStat.create({ year: 2021, totalCustomers: 10, yearlySalesTotal: 100, yearlyTotalSoldUnits: 5 });
    const res = await request(makeApp()).get("/sales/sales");
    expect(res.status).toBe(200);
    expect(res.body.year).toBe(2021);
  });
});
