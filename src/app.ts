import cors from "cors";
import express from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json({ status: "gateway online" });
});

app.use(routes);

export default app;
