const tmi = require("tmi.js");

const client = new tmi.client({
  options: { debug: false, messagesLogLevel: "warn" },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: "oauth:" + process.env.TWITCH_PW,
  },
  channels: process.env.CHANNELS.split(","),
});

module.exports = client;
