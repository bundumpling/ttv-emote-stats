const axios = require("axios");
const client = require("../client");

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
    let { emoteCodes, channelID } = response.data;
    return { emoteCodes, channelID };
  } catch (error) {
    throw new Error(error.response);
  }
}

async function getEmoteCount(emoteID) {
  try {
    let response = await axios.get(
      `http://localhost:8081/emote/${emoteID}/count`
    );
    let { count } = response.data;
    return count;
  } catch (error) {
    throw new Error(error.response);
  }
}

async function getEmoteCountForUsername(emoteID, username) {
  try {
    let response = await axios.get(
      `http://localhost:8081/emote/${emoteID}/usedBy`
    );
    let { usedBy } = response.data;

    const result = Object.keys(usedBy).find(
      (user) => user.split("-")[0] === username
    );
    if (result !== undefined) {
      return usedBy[result];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.response);
  }
}

async function getEmoteTopUser(emoteID) {
  try {
    let response = await axios.get(
      `http://localhost:8081/emote/${emoteID}/usedBy`
    );
    let { usedBy } = response.data;

    let topUser = {
      username: null,
      count: 0,
    };
    Object.keys(usedBy).forEach((username) => {
      if (usedBy[username] > topUser.count) {
        topUser.username = username.split("-")[0];
        topUser.count = usedBy[username];
      }
    });
    return topUser;
  } catch (error) {
    throw new Error(error.response);
  }
}

async function getEmoteTopDate(emoteID) {
  try {
    let response = await axios.get(
      `http://localhost:8081/emote/${emoteID}/usedOn`
    );
    let { usedOn } = response.data;

    let topDate = {
      dateKey: null,
      count: 0,
    };
    Object.keys(usedOn).forEach((dateKey) => {
      if (usedOn[dateKey] > topDate.count) {
        topDate.dateKey = dateKey;
        topDate.count = usedOn[dateKey];
      }
    });
    const year = Number(String(topDate.dateKey).slice(0, 4));
    const month = Number(String(topDate.dateKey).slice(4, 6)) - 1;
    const day = Number(String(topDate.dateKey).slice(6));
    const date = new Date(year, month, day);
    const dateString = date.toDateString();

    return { date: dateString, count: topDate.count };
  } catch (error) {
    throw new Error(error.response);
  }
}

class MessageHandler {
  constructor() {
    this._commands = {
      "%ecount": this._ecount,
      "%ecountuser": this._ecountuser,
      "%etopuser": this._etopuser,
      "%etopdate": this._etopdate,
    };
  }

  async _ecount({ channelName, channelID, words }) {
    const emoteCode = words[0];
    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let count = await getEmoteCount(emoteID);
        if (!isNaN(count)) {
          client.say(`#${channelName}`, `${emoteCode} used ${count} times.`);
        }
      } catch (error) {
        console.log(`Error getting emote count for emoteID: ${emoteID}`);
      }
    }
  }

  async _ecountuser({ channelName, channelID, username, words }) {
    const emoteCode = words[0];

    // Get count for requesting user if no user specified as second parameter
    username = words[1] ? words[1].toLowerCase() : username.toLowerCase();

    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let count = await getEmoteCountForUsername(emoteID, username);
        if (count !== null) {
          client.say(
            `#${channelName}`,
            `${username} used ${emoteCode} ${count} times.`
          );
        } else {
          client.say(
            `#${channelName}`,
            `No record of ${username} using ${emoteCode}`
          );
        }
      } catch (error) {
        console.log(
          `Error getting ${username}'s count for emoteID: ${emoteID}`
        );
      }
    }
  }

  async _etopuser({ channelName, channelID, words }) {
    const emoteCode = words[0];
    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let topUser = await getEmoteTopUser(emoteID);
        if (topUser && topUser.username && topUser.count) {
          client.say(
            `#${channelName}`,
            `${emoteCode} used most by ${topUser.username} (${topUser.count} times)`
          );
        }
      } catch (error) {
        console.log(`Error getting top user for emoteID: ${emoteID}`);
      }
    }
  }

  async _etopdate({ channelName, channelID, words }) {
    const emoteCode = words[0];
    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let topDate = await getEmoteTopDate(emoteID);
        if (topDate && topDate.date && topDate.count) {
          client.say(
            `#${channelName}`,
            `${emoteCode} used most on ${topDate.date} (${topDate.count} times)`
          );
        }
      } catch (error) {
        console.log(`Error getting top date for emoteID: ${emoteID}`);
      }
    }
  }

  static async build() {
    let messageHandler = new MessageHandler();
    await messageHandler._init();
    return messageHandler;
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
    this._channelNameToChannelID = {};

    try {
      process.env.CHANNELS.split(",").forEach(async (channelName) => {
        const { emoteCodes, channelID } = await getChannelEmoteCodes(
          channelName
        );
        this._emoteCodes[channelName] = emoteCodes;
        this._channelNameToChannelID[channelName] = channelID;
        console.log(
          `added ${emoteCodes.length} channel emote codes for ${channelName}`
        );
      });
    } catch (error) {
      console.log(error);
    }

    this._messageParser = async (channel, tags, message, self) => {
      // const start = Date.now();
      if (self) return;
      // remove # at start of channel name
      const channelName = channel.slice(1);
      try {
        const codes = this._emoteCodes[channelName];
        const username = tags.username;
        const userID = tags["user-id"];

        const words = message.split(" ");

        if (this._commands.hasOwnProperty(words[0])) {
          const args = {
            channelName,
            channelID: this._channelNameToChannelID[channelName],
            username,
            userID,
            words: words.slice(1),
          };
          this._commands[words[0]].apply(this, [args]);
        }

        const matches = words.filter((word) => codes.includes(word));

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
              channelName,
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

      // const end = Date.now();
      // const duration = end - start;
      // console.log(`--- message parsed in ${duration}ms ---`);
    };
  }

  get parser() {
    return this._messageParser;
  }
}

module.exports = { MessageHandler };
