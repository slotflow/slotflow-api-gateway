import app from "./app/app";
import { Duplex } from "stream";
import http, { IncomingMessage } from "http";
import { appConfig } from "./config/env";
import { log } from "./shared/logger/logger";
import { initOtel } from "./app/init/otel.init";
import { socketProxy } from "./proxy/socketProxy";
import { printText } from "./shared/utils/printText";
import { setupGracefulShutdown } from "./app/init/shutdown";

let server: http.Server;

type WebSocketProxy = typeof socketProxy & {
  upgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
};

const start = async () => {
  try {
    await initOtel();

    server = http.createServer(app);

    server.on("upgrade", (req, socket, head) => {
      if (req.url?.includes("/socket.io")) {
        (socketProxy as WebSocketProxy).upgrade(req, socket, head);
      }
    });

    server.listen(appConfig.port, () => {
      printText();
      log.info(`Live on http://localhost:${appConfig.port}`);
    });

    setupGracefulShutdown(server);
  } catch (error) {
    log.error("Failed to start API Gateway", { error });
    process.exit(1);
  }
};

start();
