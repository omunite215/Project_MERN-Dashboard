import "reflect-metadata";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { createApp } from "./app.js";

async function main() {
  await connectDB(env.MONGODB_URL);
  const app = createApp({ clientOrigin: env.CLIENT_ORIGIN });
  const server = app.listen(env.PORT, () => console.log(`Server listening on port ${env.PORT}`));

  const shutdown = async (sig: string) => {
    console.log(`${sig} received, shutting down...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
