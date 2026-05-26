import { stopOtel } from "./otel.init";
import { IncomingMessage, Server, ServerResponse } from "http";

export const setupGracefulShutdown = async (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const shutdown = async () => {
    console.log("Shutting down...");

    try {
        await stopOtel();

      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });

    } catch (err) {
      console.error("Shutdown error", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};