var AppDBHelper = require("./src/helpers/database/AppDBHelper");

async function start() {
  await AppDBHelper.Connect();
  await AppDBHelper.GenerateDummy();
}

start();
