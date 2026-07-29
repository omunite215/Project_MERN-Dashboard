import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { ApiError } from "../src/utils/ApiError.js";
import { asyncHandler } from "../src/middlewares/asyncHandler.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { notFound } from "../src/middlewares/notFound.js";

function buildApp() {
  const app = express();
  app.get(
    "/boom",
    asyncHandler(async () => {
      throw ApiError.notFound("nope");
    })
  );
  app.get(
    "/crash",
    asyncHandler(async () => {
      throw new Error("unexpected");
    })
  );
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

describe("error pipeline", () => {
  it("maps ApiError to its status + message", async () => {
    const res = await request(buildApp()).get("/boom");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("nope");
  });

  it("maps unknown errors to 500", async () => {
    const res = await request(buildApp()).get("/crash");
    expect(res.status).toBe(500);
    expect(res.body.message).toBeTruthy();
  });

  it("returns 404 for unmatched routes", async () => {
    const res = await request(buildApp()).get("/missing");
    expect(res.status).toBe(404);
  });
});
