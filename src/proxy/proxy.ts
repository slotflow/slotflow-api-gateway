import type { Socket } from "net";
import { Request } from "express";
import { log } from "../shared/logger/logger";
import type { IncomingMessage, ServerResponse } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { attachHeaders } from "../shared/utils/attachHeader";
import { AuthUser } from "../shared/utils/types";

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
        const expressReq = req as Request;
        const user = expressReq.user as AuthUser;

        const originalUrl = req.url;
        const proxiedPath = proxyReq.path;

        try {
          const targetUrl = new URL(target);
          log.info(
            `[GATEWAY PROXY] ${req.method} ${originalUrl} → ${targetUrl.origin}${proxiedPath}`
          );
        } catch {
          log.info(
            `[GATEWAY PROXY] ${req.method} ${originalUrl} → ${target}${proxiedPath}`
          );
        }

        if (user) {
          attachHeaders(proxyReq, user);
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
        };
      }
    }
  }
  );
};