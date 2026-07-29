import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { authenticate } from "./middlewares/authenticate.js";
import authRouter from "./routes/auth.js";
import clientRouter from "./routes/client.js";
import generalRouter from "./routes/general.js";
import managementRouter from "./routes/management.js";
import salesRouter from "./routes/sales.js";
import productsRouter from "./routes/products.js";

export function createApp(options: { clientOrigin?: string | string[] } = {}): Express {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(morgan(process.env.NODE_ENV === "test" ? "tiny" : "common"));
  app.use(cors({ origin: options.clientOrigin ?? true, credentials: true }));
  app.use(rateLimiter);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/auth", authRouter);

  app.use("/products", productsRouter);
  app.use("/client", authenticate, clientRouter);
  app.use("/general", authenticate, generalRouter);
  app.use("/management", authenticate, managementRouter);
  app.use("/sales", authenticate, salesRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
