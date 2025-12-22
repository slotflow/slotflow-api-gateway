import type { Socket } from "net";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { IncomingMessage, ServerResponse } from "http";
import { GatewayRequest } from "../middleware/auth.middleware";

export const proxy = (target: string) =>
  createProxyMiddleware<IncomingMessage, ServerResponse>({
    target,
    changeOrigin: true,
    secure: false,
    proxyTimeout: 5000,

    on: {
      proxyReq: (proxyReq, req) => {
        const gatewayReq = req as GatewayRequest;

        if (gatewayReq.user) {
          proxyReq.setHeader("x-user-id", gatewayReq.user.id);
          proxyReq.setHeader("x-user-role", gatewayReq.user.role);
        }
      },

      error: (
        _err: Error,
        _req: IncomingMessage,
        res: ServerResponse | Socket
      ) => {
        if ("destroy" in res && !("statusCode" in res)) {
          res.destroy();
          return;
        }

        const serverRes = res as ServerResponse;

        if (!serverRes.headersSent) {
          serverRes.statusCode = 502;
          serverRes.setHeader("Content-Type", "application/json");
          serverRes.end(
            JSON.stringify({ message: "Service unavailable" })
          );
        }
      }
    }
  });
