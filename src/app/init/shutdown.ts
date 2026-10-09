import { stopOtel } from "./otel.init";
import { log } from "../../shared/logger/logger";
import { IncomingMessage, Server, ServerResponse } from "http";

export const setupGracefulShutdown = async (
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) => {
  const shutdown = async () => {
    log.info("Shutting down...");

    try {
      await stopOtel();

      server.close(() => {
        log.info("Server closed");
        process.exit(0);
      });
    } catch (err) {
      log.error("Server initialization failed", {
        error:
          err instanceof Error
            ? {
                name: err.name,
                message: err.message,
                stack: err.stack,
              }
            : String(err),
      });
      process.exit(1);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};
