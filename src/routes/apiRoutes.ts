import v1Routes from "./v1";
import { Router } from "express";
import type { Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

router.use("/v1", v1Routes);

export default router;
