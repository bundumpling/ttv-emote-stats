const client = require("../client");
const { EmoteTracker } = require("./EmoteTracker");

class MessageHandler {
  constructor() {}
  static async build() {
    let messageHandler = new MessageHandler();
    await messageHandler._init();
    return messageHandler;
  }
  async _init() {
    const emoteTracker = await EmoteTracker.build();

    this._messageHandler = (channel, tags, message, self) => {
      if (self) return;

      // remove # from channel name
      emoteTracker.messageParser(channel.slice(1), tags, message);
    };
  }

  get commands() {
    return this._commands;
  }

  get messageHandler() {
    return this._messageHandler;
  }
}

module.exports = { MessageHandler };
