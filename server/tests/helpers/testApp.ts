import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "../../src/config/db.js";
import { createApp } from "../../src/app.js";

let mongo: MongoMemoryServer;

export async function connectTestDB() {
  mongo = await MongoMemoryServer.create();
  await connectDB(mongo.getUri());
}

export async function closeTestDB() {
  await disconnectDB();
  await mongo.stop();
}

export function makeApp() {
  return createApp({ clientOrigin: "http://localhost:3000" });
}
