import { Socket } from "net";
import type { Request } from "express";
import { serviceConfig } from "../config/env";
import { AuthUser } from "../shared/utils/types";
import type { IncomingMessage, ServerResponse } from "http";
import { attachHeaders } from "../shared/utils/attachHeader";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const socketTarget = serviceConfig.realtimeServiceUrl;

export const socketProxy = createProxyMiddleware<IncomingMessage, ServerResponse>({
  target: socketTarget,
  ws: true,
  changeOrigin: true,
  pathFilter: (path) => path.includes("/socket.io"),
  on: {

    // Triggered during standard HTTP long-polling handshakes
    // Starting of socket connection we need  Standard HTTP
    // GET /socket.io/?EIO=4&transport=polling  ──> Triggers proxyReq
    proxyReq: (proxyReq, req) => {
      console.log("socketProxy [HTTP]: FORWARDING TO:", socketTarget + proxyReq.path);
      const expressReq = req as Request;
      const user = expressReq.user as AuthUser;
      if (user) {
        attachHeaders(proxyReq, user);
      }
    },

    // Triggered when upgrading raw WebSocket connections eg transports: ['websocket']
    // WS Upgrade] ──> GET /socket.io/?EIO=4&transport=websocket ──> Triggers proxyReqWs
    proxyReqWs: (proxyReq, req, socket) => {
      console.log("socketProxy [WS UPGRADE]: FORWARDING TO:", socketTarget + proxyReq.path);
      const expressReq = req as Request;

      authMiddleware(expressReq, socket, (err?: any) => {
        if (err) {
          console.error("Auth failed during WS Upgrade:", err);
          return;
        }

        const user = expressReq.user as AuthUser;
        if (user) {
          console.log("Authenticated WS Upgrade User:", user.id);
          attachHeaders(proxyReq, user);
        }
      });
    },

    // error logging for socket proxy errors
    error: (_err: Error, _req: IncomingMessage, res: ServerResponse | Socket) => {
      if ("destroy" in res && !("statusCode" in res)) {
        res.destroy();
      }
    },

  }
});