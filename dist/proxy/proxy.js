import { log } from "../shared/logger/logger";
import { createProxyMiddleware } from "http-proxy-middleware";
export const proxy = (target, pathRewrite) => {
    if (!target) {
        throw new Error("Proxy target is undefined. Check environment variables.");
    }
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        secure: false,
        proxyTimeout: 5000,
        pathRewrite,
        on: {
            proxyReq: (proxyReq, req) => {
                const expressReq = req;
                const originalUrl = req.url;
                const proxiedPath = proxyReq.path;
                try {
                    const targetUrl = new URL(target);
                    log.info(`[GATEWAY PROXY] ${req.method} ${originalUrl} → ${targetUrl.origin}${proxiedPath}`);
                }
                catch {
                    log.info(`[GATEWAY PROXY] ${req.method} ${originalUrl} → ${target}${proxiedPath}`);
                }
                log.info(`expressReq.user : ${JSON.stringify(expressReq.user)}`);
                if (expressReq.user) {
                    if (expressReq.user.id) {
                        proxyReq.setHeader("x-user-id", expressReq.user.id);
                    }
                    proxyReq.setHeader("x-user-role", expressReq.user.role);
                }
            },
            error: (_err, _req, res) => {
                if ("destroy" in res && !("statusCode" in res)) {
                    res.destroy();
                    return;
                }
                const serverRes = res;
                if (!serverRes.headersSent) {
                    serverRes.statusCode = 502;
                    serverRes.setHeader("Content-Type", "application/json");
                    serverRes.end(JSON.stringify({ message: "Service unavailable" }));
                }
                ;
            }
        }
    });
};
