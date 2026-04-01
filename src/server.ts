import http from 'http';
import app from "./app";
import { appConfig } from "./config/env";
import { log } from "./shared/logger/logger";
import { socketProxy } from './proxy/socketProxy';
import { printText } from './shared/utils/printText';

const server = http.createServer(app);

// Handle WebSocket upgrade for Socket.IO
server.on("upgrade", (req, socket, head) => {
  console.log("req.url : ", req.url);
  if (req.url?.startsWith("/socket.io")) {
    (socketProxy as any).upgrade(req, socket, head);
  }
});

server.listen(appConfig.port, () => {
  printText();
  log.info(`Live on http://localhost:${appConfig.port}`);
});