import "reflect-metadata";
import { env } from "../config/env.js";
import { connectDB, disconnectDB } from "../config/db.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

async function run() {
  await connectDB(env.MONGODB_URL);
  const users = await User.find().select("+password");
  let changed = 0;
  for (const u of users) {
    if (u.password && !u.password.startsWith("$argon2")) {
      const hashed = await hashPassword(u.password);
      // updateOne bypasses the pre-save hook, so the stored value is hashed exactly once.
      await User.updateOne({ _id: u._id }, { $set: { password: hashed } });
      changed++;
    }
  }
  console.log(`Hashed ${changed} plaintext passwords (of ${users.length}).`);
  await disconnectDB();
}
run().catch((e) => { console.error(e); process.exit(1); });
