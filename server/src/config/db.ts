import mongoose from "mongoose";

let connPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(uri: string) {
  if (connPromise) return connPromise;
  mongoose.set("strictQuery", true);
  connPromise = mongoose.connect(uri, { maxPoolSize: 5 });
  return connPromise;
}

export async function disconnectDB() {
  if (!connPromise) return;
  await mongoose.disconnect();
  connPromise = null;
}
