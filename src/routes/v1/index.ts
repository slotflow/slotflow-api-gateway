import { Router } from "express";
import { proxy } from "../../proxy/proxy";
import { serviceConfig } from "../../config/env";
import { authMiddleware } from "../../middleware/auth.middleware";
import { blockCheckMiddleware } from "../../middleware/blockCheck.middleware";

const router = Router();

router.use(
  "/auth",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/auth/",
  })
);

router.use(authMiddleware);

router.use(
  "/user",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/user/"
  })
);

router.use("/google",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/google/",
  }));

router.use("/s3",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/s3/",
  }));

router.use(
  "/provider",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/provider/"
  })
);

router.use(
  "/admin",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/admin/"
  })
);

router.use(
  "/subscriptions",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/subscriptions/"
  })
);

router.use(
  "/bookings",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/bookings/"
  })
);

router.use(
  "/notification",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.notificationServiceUrl, {
    "^/": "/notification/"
  })
);

router.use(
  "/user-device",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.notificationServiceUrl, {
    "^/": "/user-device/"
  })
);

router.use(
  "/payments",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.paymentServiceUrl, {
    "^/": "/payments/"
  })
);

router.use(
  "/real-time",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.realtimeServiceUrl, {
    "^/": "/real-time/"
  })
);

export default router;
