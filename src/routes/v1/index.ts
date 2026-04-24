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
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/addresses/"
  })
);

router.use(
  "/admin-dashboard",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/admin-dashboard/"
  })
);

router.use(
  "/bookings",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/bookings/"
  })
);

router.use("/google",
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/google/",
  }));

router.use(
  "/messages",
  blockCheckMiddleware,
  proxy(serviceConfig.realtimeServiceUrl, {
    "^/": "/api/messages/"
  })
);

router.use(
  "/notifications",
  blockCheckMiddleware,
  proxy(serviceConfig.notificationServiceUrl, {
    "^/": "/api/v1/notifications/"
  })
);

router.use(
  "/payments",
  blockCheckMiddleware,
  proxy(serviceConfig.paymentServiceUrl, {
    "^/": "/api/v1/payments/"
  })
);

router.use(
  "/plans",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/plans/"
  })
);

router.use(
  "/providers",
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/providers/"
  })
);

router.use(
  "/provider-services",
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/provider-services/"
  })
);

router.use(
  "/reviews",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/reviews/"
  })
);

router.use("/s3",
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/s3/",
  }));

router.use("/services",
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/services/",
  }));


router.get(
  '/service-availabilities/engaged-slots/:providerId/:date',
  blockCheckMiddleware,
  engagedSlots
)

router.use(
  "/service-availabilities",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/service-availabilities/"
  })
);

router.use(
  "/subscriptions",
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/subscriptions/"
  })
);

router.use(
  "/users",
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/users/"
  })
);

router.use(
  "/provider-dashboard",
  blockCheckMiddleware,
  proxy(serviceConfig.mainBackendServiceUrl, {
    "^/": "/api/v1/provider-dashboard/"
  })
);

router.use(
  "/user-devices",
  blockCheckMiddleware,
  proxy(serviceConfig.notificationServiceUrl, {
    "^/": "/api/v1/user-devices/"
  })
);

export default router;
