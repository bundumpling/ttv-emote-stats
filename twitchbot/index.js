require("dotenv").config();
const client = require("./client");
const { MessageHandler } = require("./handlers/MessageHandler");

(async () => {
  let messageHandler = await MessageHandler.build();
  client.connect();

  client.on("message", messageHandler.messageHandler);
})();
