import { Router } from "express";
import { proxy } from "../proxy/proxy";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use("/api", authMiddleware);

router.use("/api",proxy(process.env.MAIN_BACKEND_URL as string));

router.use("/api/payments",proxy(process.env.PAYMENT_SERVICE_URL as string));

export default router;
