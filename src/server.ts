import http from "http";
import app from "./app/app";
import { appConfig } from "./config/env";
import { log } from "./shared/logger/logger";
import { initOtel } from "./app/init/otel.init";
import { socketProxy } from './proxy/socketProxy';
import { printText } from './shared/utils/printText';
import { setupGracefulShutdown } from './app/init/shutdown';

let server: http.Server;

const start = async () => {
  try {
    // await initOtel();

    server = http.createServer(app);

    server.on("upgrade", (req, socket, head) => {
      if (req.url?.startsWith("/socket.io")) {
        (socketProxy as any).upgrade(req, socket, head);
      }
    });

    server.listen(appConfig.port, () => {
      printText();
      log.info(`Live on http://localhost:${appConfig.port}`);
    });

    setupGracefulShutdown(server);

  } catch (error) {
    log.error("Failed to start API Gateway", error as Error);
    process.exit(1);
  }
};

start();