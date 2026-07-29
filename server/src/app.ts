import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

export function createApp(options: { clientOrigin?: string } = {}): Express {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(morgan(process.env.NODE_ENV === "test" ? "tiny" : "common"));
  app.use(cors({ origin: options.clientOrigin ?? true, credentials: true }));
  app.use(rateLimiter);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // ROUTES-MOUNT-POINT (routers mounted here in Tasks 1.8–1.11)

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
