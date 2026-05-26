import cors from "cors";
import express from "express";
import routes from "../routes/apiRoutes";
import cookieParser from "cookie-parser";
import { serviceConfig } from "../config/env";
import { socketProxy } from "../proxy/socketProxy";
import { errorHandler } from "../middleware/error.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { blockCheckMiddleware } from "../middleware/blockCheck.middleware";

const app = express();

app.use(cors({
  origin: serviceConfig.frontendUrl,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(cookieParser());

app.use((req, _res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


app.use("/api", routes);

app.use(
  authMiddleware,
  blockCheckMiddleware,
  socketProxy
);

app.get("/", (_, res) => {
  res.json({ status: "gateway online" });
});
app.use(errorHandler);

export default app;
