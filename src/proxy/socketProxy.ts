import { createProxyMiddleware } from "http-proxy-middleware";
import { serviceConfig } from "../config/env";
import type { IncomingMessage, ServerResponse } from "http";
import { log } from "../shared/logger/logger";
import type { Request } from "express";

const socketTarget = serviceConfig.realtimeServiceUrl.replace("/api", "");

export const socketProxy = createProxyMiddleware<IncomingMessage, ServerResponse>({
  target: socketTarget,
  ws: true,
  changeOrigin: true,
  pathFilter: "/socket.io",
  on: {
      
    proxyReq: (proxyReq, req) => {
    console.log("FORWARDING TO:", socketTarget + proxyReq.path);
      const expressReq = req as Request;

      const originalUrl = req.url;
      const proxiedPath = proxyReq.path;

      try {
        console.log("socketProxy");
        const targetUrl = new URL(socketTarget);
        log.info(
          `[GATEWAY PROXY] ${req.method} ${originalUrl} → ${targetUrl.origin}${proxiedPath}`
        );
      } catch {
        log.info(
          `[GATEWAY PROXY] ${req.method} ${originalUrl} → ${socketTarget}${proxiedPath}`
        );
      }

      log.info(`expressReq.user : ${JSON.stringify(expressReq.user)}`);

      if (expressReq.user) {
        if (expressReq.user.id) {
          proxyReq.setHeader("x-user-id", expressReq.user.id);
        }
        proxyReq.setHeader("x-user-role", expressReq.user.role);
      }

    },
  }

});