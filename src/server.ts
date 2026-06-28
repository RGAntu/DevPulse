import app from "./app.js";
import config from "./config/index";

import { initDB } from "./db/db";


const main = async () => {       
  await initDB();
  app.listen(config.port, () => {
    console.log(` Server running on port ${config.port}`);
  });
};

main();