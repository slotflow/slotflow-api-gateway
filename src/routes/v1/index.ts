import { Router } from "express";
import { proxy } from "../../proxy/proxy";
import { appConfig } from "../../config/env";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(
  "/auth",
  proxy(appConfig.services.mainBackend, {
    "^/": "/auth/",
  })
);

router.use(authMiddleware);

router.use(
  "/user",
  authMiddleware,
  proxy(appConfig.services.mainBackend, {
    "^/": "/user/"
  })
);

router.use("/google", proxy(appConfig.services.mainBackend, {
  "^/": "/google/",
}));

router.use(
  "/provider",
  authMiddleware,
  proxy(appConfig.services.mainBackend, {
    "^/": "/provider/"
  })
);

router.use(
  "/admin",
  authMiddleware,
  proxy(appConfig.services.mainBackend, {
    "^/": "/admin/"
  })
);

router.use(
  "/notifications",
  authMiddleware,
  proxy(appConfig.services.notification, {
    "^/": "/notifications/"
  })
);

router.use(
  "/real-time",
  authMiddleware,
  proxy(appConfig.services.realtime, {
    "^/": "/real-time/"
  })
);

export default router;
