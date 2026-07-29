import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

async function main() {
  await connectDB(env.MONGODB_URL);
  const app = createApp({ clientOrigin: env.CLIENT_ORIGIN });
  app.listen(env.PORT, () => console.log(`Server listening on port ${env.PORT}`));
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
