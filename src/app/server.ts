import app from "./app";
import * as config from "./config";
import { serviceLog } from "./configLog4j";

const server = app.listen(config.port, () => {

  serviceLog.info(`  App is running at http://localhost:${config.port} in ${app.get("env")} mode`);
  serviceLog.debug("  Press CTRL-C to stop\n");
});

export default server;
