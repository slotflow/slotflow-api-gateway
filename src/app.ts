import cors from "cors";
import express from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(cookieParser());

app.use("/api", routes);

app.get("/", (_, res) => {
  res.json({ status: "gateway online" });
});

export default app;
