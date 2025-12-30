import type { Socket } from "net";
import type { IncomingMessage, ServerResponse } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { GatewayRequest } from "../middleware/auth.middleware";

export const proxy = (target: string, pathRewrite?: Record<string, string>) => {

  if (!target) {
    throw new Error("Proxy target is undefined. Check environment variables.");
  }

  return createProxyMiddleware<IncomingMessage, ServerResponse>({
    target,
    changeOrigin: true,
    secure: false,
    proxyTimeout: 5000,

    pathRewrite,

    on: {
      proxyReq: (proxyReq, req) => {
        const gatewayReq = req as GatewayRequest;

        // 🔍 LOGGING
        const originalUrl = req.url;
        const proxiedPath = proxyReq.path;

        try {
          const targetUrl = new URL(target);
          console.log(
            `[GATEWAY PROXY] ${req.method} ${originalUrl} → ${targetUrl.origin}${proxiedPath}`
          );
        } catch {
          console.log(
            `[GATEWAY PROXY] ${req.method} ${originalUrl} → ${target}${proxiedPath}`
          );
        }

        console.log("gatewayReq.user : ",gatewayReq.user);

        if (gatewayReq.user) {
          proxyReq.setHeader("x-user-id", gatewayReq.user.id ?? 1);
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
  }
  );
}
