import v1Routes from './v1';
import { Router } from "express";

const router = Router();

router.use("/v1", v1Routes);

export default router;
