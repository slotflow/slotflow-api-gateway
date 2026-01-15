import app from "./app";
import { appConfig } from "./config/env";
import { log } from "./shared/logger/logger";

app.listen(appConfig.port, () => {
  log.info(`[SLOTFLOW API GATEWAY] running on http://localhost:${appConfig.port}`);
});
