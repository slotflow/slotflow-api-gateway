import http from 'http';
import app, { socketProxy } from "./app";
import { appConfig } from "./config/env";
import { log } from "./shared/logger/logger";
const server = http.createServer(app);
// Handle WebSocket upgrade for Socket.IO
server.on("upgrade", (req, socket, head) => {
    if (req.url?.startsWith("/socket.io")) {
        socketProxy.upgrade(req, socket, head);
    }
});
server.listen(appConfig.port, () => {
    log.info(`[SLOTFLOW API GATEWAY] running on http://localhost:${appConfig.port}`);
});
