import { Router } from "express";
import { proxy } from "../../proxy/proxy";
import { serviceConfig } from "../../config/env";
import { engagedSlots } from "../../middleware/engagedSlots";
import { authMiddleware } from "../../middleware/auth.middleware";
import { blockCheckMiddleware } from "../../middleware/blockCheck.middleware";

const router = Router();

router.use(
  "/auth",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/auth/",
  })
);

router.use(authMiddleware);

router.use(
  "/addresses",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/addresses/"
  })
);

router.use(
  "/admin-dashboard",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/admin-dashboard/"
  })
);

router.use(
  "/bookings",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/bookings/"
  })
);

router.use("/google",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/google/",
  }));

router.use(
  "/messages",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.realtimeServiceUrl, {
    "^/": "/api/messages/"
  })
);

router.use(
  "/notifications",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.notificationServiceUrl, {
    "^/": "/api/v1/notifications/"
  })
);

router.use(
  "/payments",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.paymentServiceUrl, {
    "^/": "/api/v1/payments/"
  })
);

router.use(
  "/plans",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/plans/"
  })
);

router.use(
  "/providers",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/providers/"
  })
);

router.use(
  "/provider-services",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/provider-services/"
  })
);

router.use(
  "/reviews",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/reviews/"
  })
);

router.use("/s3",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/s3/",
  }));

router.use("/services",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/services/",
  }));


  router.get(
  '/service-availabilities/engaged-slots/:providerId/:date',
  authMiddleware,
  blockCheckMiddleware,
  engagedSlots
)

router.use(
  "/service-availabilities",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/service-availabilities/"
  })
);

router.use(
  "/subscriptions",
  authMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/subscriptions/"
  })
);

router.use(
  "/users",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/users/"
  })
);

router.use(
  "/provider-dashboard",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/provider-dashboard/"
  })
);

router.use(
  "/user-devices",
  authMiddleware,
  blockCheckMiddleware,
  proxy(serviceConfig.notificationServiceUrl, {
    "^/": "/api/v1/user-devices/"
  })
);

export default router;
