import cors from "cors";
import express from "express";
import routes from "./routes/apiRoutes";
import cookieParser from "cookie-parser";
import { serviceConfig } from "./config/env";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authMiddleware } from "./middleware/auth.middleware";
import { blockCheckMiddleware } from "./middleware/blockCheck.middleware";
import { log } from "./shared/logger/logger";
const app = express();
// Proxy /socket.io traffic to the Realtime Service (port 5000)
// Authenticity is checked via authMiddleware and blockCheckMiddleware on the initial handshake (polling or upgrade request)
app.use(cors({
    origin: serviceConfig.frontendUrl,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(cookieParser());
// Proxy /socket.io traffic to the Realtime Service (port 5000)
// Authenticity is checked via authMiddleware and blockCheckMiddleware on the initial handshake (polling or upgrade request)
const socketTarget = serviceConfig.realtimeServiceUrl.replace("/api", "");
export const socketProxy = createProxyMiddleware({
    target: socketTarget,
    ws: true,
    changeOrigin: true,
    pathFilter: "/socket.io",
    on: {
        proxyReq: (proxyReq, req) => {
            const expressReq = req;
            const originalUrl = req.url;
            const proxiedPath = proxyReq.path;
            try {
                const targetUrl = new URL(socketTarget);
                log.info(`[GATEWAY PROXY] ${req.method} ${originalUrl} → ${targetUrl.origin}${proxiedPath}`);
            }
            catch {
                log.info(`[GATEWAY PROXY] ${req.method} ${originalUrl} → ${socketTarget}${proxiedPath}`);
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
app.use("/socket.io", authMiddleware, blockCheckMiddleware, socketProxy);
app.use("/api", routes);
app.get("/", (_, res) => {
    res.json({ status: "gateway online" });
});
export default app;
