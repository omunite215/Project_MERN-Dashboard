import mongoose from "mongoose";

export async function connectDB(uri: string) {
  mongoose.set("strictQuery", true);
  return mongoose.connect(uri);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
