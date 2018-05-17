import app from "./app";
import { logFactory, serviceLog } from "./configLog4j";

const server = app.listen(app.get("port"), () => {

  serviceLog.info(`  App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
  serviceLog.debug("  Press CTRL-C to stop\n");
});

export default server;
