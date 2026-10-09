import cors from "cors";
import routes from "../routes/apiRoutes";
import cookieParser from "cookie-parser";
import { serviceConfig } from "../config/env";
import { log } from "../shared/logger/logger";
import express, { type Express } from "express";
import { socketProxy } from "../proxy/socketProxy";
import { errorHandler } from "../middleware/error.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { globalRateLimit } from "../middleware/rateLimit.middleware";
import { blockCheckMiddleware } from "../middleware/blockCheck.middleware";

const app: Express = express();

// Trust the proxy in front of the gateway to get the actual client IP for rate limiting; otherwise, Express may receive the proxys IP instead.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: serviceConfig.frontendUrl,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(cookieParser());

app.use((req, _res, next) => {
  log.debug("Incoming request", {
    method: req.method,
    path: req.path,
  });
  next();
});

app.use("/api", globalRateLimit);

app.use("/api", routes);

app.use("/socket.io", authMiddleware, blockCheckMiddleware, socketProxy);

app.get("/", (_, res) => {
  res.json({ status: "gateway online" });
});

app.use(errorHandler);

export default app;
