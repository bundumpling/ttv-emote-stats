const axios = require("axios");

async function login() {
  try {
    let response = await axios.post(
      "http://localhost:8081/auth/login",
      {
        username: process.env.API_LOGIN_USERNAME,
        password: process.env.API_LOGIN_PW,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let token = response.data.data.token;
    return token;
  } catch (error) {
    throw new Error(error.response);
  }
}

async function getChannelEmoteCodes(channelName) {
  try {
    let response = await axios.get(
      `http://localhost:8081/channel/${channelName}/emoteCodes`
    );
    let { emoteCodes } = response.data;
    return emoteCodes;
  } catch (error) {
    throw new Error(error.response);
  }
}

class EmoteTracker {
  constructor() {}

  static async build() {
    let emoteTracker = new EmoteTracker();
    await emoteTracker._init();
    return emoteTracker;
  }

  async _init() {
    // Get auth JWT
    let token;
    try {
      token = await login();
    } catch (error) {
      console.log(error);
    }

    this._emoteCodes = {};
    try {
      process.env.CHANNELS.split(",").forEach(async (channelName) => {
        const codes = await getChannelEmoteCodes(channelName);
        this._emoteCodes[channelName] = codes;
      });
      console.log("added channel emote codes for " + process.env.CHANNELS);
    } catch (error) {
      console.log(error);
    }

    this._messageParser = async (channel, tags, message) => {
      const start = Date.now();
      try {
        const codes = this._emoteCodes[channel];
        const username = tags.username;
        const userID = tags["user-id"];
        // console.log(`${codes.length} Emotes for ${channel}... in messageParser`);
        const matches = message
          .split(" ")
          .filter((word) => codes.includes(word));

        if (matches.length) {
          let counts = {};
          matches.forEach((match) => {
            if (counts[match]) counts[match]++;
            else counts[match] = 1;
          });

          await axios.post(
            "http://localhost:8081/admin/updateCountsFromBot",
            {
              token,
              channel,
              username,
              userID,
              timestamp: Number(tags["tmi-sent-ts"]),
              counts,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.log(error);
      }

      const end = Date.now();
      const duration = end - start;
      // console.log(`--- message parsed in ${duration}ms ---`);
    };
  }

  get messageParser() {
    return this._messageParser;
  }
}

module.exports = { EmoteTracker };
