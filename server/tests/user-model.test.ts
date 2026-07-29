import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "../src/config/db.js";
import User from "../src/models/User.js";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri());
});
afterAll(async () => {
  await disconnectDB();
  await mongo.stop();
});

describe("User model", () => {
  it("hashes password on save and comparePassword works", async () => {
    const u = await User.create({ name: "A", email: "a@x.co", password: "secret12" });
    expect(u.password).not.toBe("secret12");                 // hashed
    expect(u.password?.startsWith("$argon2")).toBe(true);    // Bun.password argon2id
    expect(await u.comparePassword("secret12")).toBe(true);
    expect(await u.comparePassword("wrong")).toBe(false);
  });
  it("defaults role to user and tokenVersion to 0", async () => {
    const u = await User.create({ name: "B", email: "b@x.co", password: "secret12" });
    expect(u.role).toBe("user");
    expect(u.tokenVersion).toBe(0);
  });
  it("excludes password by default (select:false)", async () => {
    await User.create({ name: "C", email: "c@x.co", password: "secret12" });
    const found = await User.findOne({ email: "c@x.co" });
    expect(found?.password).toBeUndefined();
    const withPw = await User.findOne({ email: "c@x.co" }).select("+password");
    expect(withPw?.password).toBeDefined();
  });
});
