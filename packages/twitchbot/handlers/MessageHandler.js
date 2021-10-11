const axios = require("axios");
const client = require("../client");

const { dateToDateKey, dateKeyToDateString } = require("../helpers/date");
const { readConfigJSON, writeConfigJSON } = require("../helpers/config");

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
  // Bot should not track or respond to requests regarding obsolete (removed by channel owner or provider) emotes.
  try {
    let response = await axios.get(
      `http://localhost:8081/channel/${channelName}/emoteCodes?ignoreObsolete=true`
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

async function getEmoteTopUsers(emoteID) {
  try {
    let response = await axios.get(
      `http://localhost:8081/emote/${emoteID}/usedBy`
    );
    let { usedBy } = response.data;

    const n = 3; // number of top users to return

    const topUsernames = Object.keys(usedBy)
      .slice()
      .sort((a, b) => usedBy[b] - usedBy[a])
      .slice(0, n);

    const topUsers = topUsernames.map((username) => {
      return {
        username: username.split("-")[0],
        count: usedBy[username],
      };
    });
    return topUsers;
  } catch (error) {
    throw new Error(error.response);
  }
}

async function getEmoteCountForDate(emoteID, dateKey) {
  try {
    let response = await axios.get(
      `http://localhost:8081/emote/${emoteID}/usedOn`
    );
    let { usedOn } = response.data;
    const count = usedOn[dateKey] ? usedOn[dateKey] : null;
    return count;
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
    const dateString = dateKeyToDateString(topDate.dateKey);

    return { date: dateString, count: topDate.count };
  } catch (error) {
    throw new Error(error.response);
  }
}

async function getUpdatedChannelEmotes(channelName, token) {
  try {
    const URL = `http://localhost:8081/channel/${channelName}/emotesFromDbAndProviders`;
    let response = await axios.get(URL, { headers: { authorization: token } });
    const { emotesFromDatabase, emotesFromProviders } = response.data;

    let result = {};

    emotesFromDatabase.forEach((emote) => {
      const { code, image, provider, providerID, obsolete } = emote;
      result[code] = {
        code,
        image,
        provider,
        providerID,
        obsolete,
        isUnavailable: true,
        isNew: false,
        isUpdated: false,
      }; // flag obsolete until matching provider emote found
    });

    emotesFromProviders.forEach((emote) => {
      const { code, image, provider, providerID } = emote;

      if (!result[code]) {
        // NEW EMOTE
        result[code] = {
          code,
          image,
          provider,
          providerID,
          obsolete: false,
          isNew: true,
          isUnavailable: false,
          isUpdated: false,
        };
      } else {
        // Compare...
        if (
          result[code].image !== image ||
          result[code].provider !== provider ||
          result[code].providerID !== providerID
        ) {
          result[code] = {
            code,
            image,
            provider,
            providerID,
            obsolete: false,
            isUpdated: true,
            isNew: false,
            isUnavailable: false,
          };
        } else {
          result[code] = {
            ...result[code],
            obsolete: false,
            isUpdated: false,
            isUnavailable: false,
            isNew: false,
          };
        }
      }
    });

    return Object.keys(result).map((code) => ({ ...result[code] }));
  } catch (error) {
    throw new Error(error);
  }
}

async function saveUpdatedChannelEmotes(
  channelName,
  channelID,
  updatedEmotes,
  token
) {
  const emotes = updatedEmotes
    .filter((emote) => {
      return emote.isNew || emote.isUnavailable || emote.isUpdated;
    })
    .map((emote) => {
      if (emote.isUnavailable) {
        return { ...emote, obsolete: true };
      } else {
        return emote;
      }
    });

  try {
    const URL = `http://localhost:8081/channel/${channelName}/saveUpdatedEmotes`;
    const response = await axios.post(URL, {
      token,
      channelID,
      emotes,
    });
    return response.status === 200;
  } catch (err) {
    throw new Error(err);
  }
}

class MessageHandler {
  constructor() {
    this._commands = {
      "%ecount": this._ecount,
      "%ecountuser": this._ecountuser,
      "%ecountdate": this._ecountdate,
      "%etopuser": this._etopuser,
      "%etopusers": this._etopusers,
      "%etopdate": this._etopdate,
      "%commands": this._commands,
      "%restricted": this._restricted,
      "%update": this._update,
    };

    this._config = {};
    this._token = null;
  }

  async _update({ channelName, username, channelID }) {
    let message;

    if (this.userIsChannelOwner(channelName, username)) {
      try {
        const updatedEmotes = await getUpdatedChannelEmotes(
          channelName,
          this._token
        );
        const success = await saveUpdatedChannelEmotes(
          channelName,
          channelID,
          updatedEmotes,
          this._token
        );

        if (!success) {
          message = "Error updating emotes :(";
          client.say(`#${channelName}`, message);
          console.log(`ERROR: Failed to update emotes for #${channelName}`);
        } else {
          const updateSummary = {
            New: 0,
            Obsolete: 0,
            Changed: 0,
          };
          updatedEmotes.forEach((emote) => {
            if (emote.isNew) updateSummary.New++;
            else if (emote.isObsolete) updateSummary.Obsolete++;
            else if (emote.isUpdated) updateSummary.Changed++;
          });

          const summaryText = Object.keys(updateSummary)
            .filter((key) => updateSummary[key] > 0)
            .map((key) => `${key}: ${updateSummary[key]}`)
            .join(" ");

          message = summaryText.length
            ? `Emotes Updated (${summaryText})`
            : "Emotes are already up-to-date (no changes detected).";

          client.say(`#${channelName}`, message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      message = `Command %update may only be used by the channel owner.`;
      client.say(`#${channelName}`, message);
    }
  }

  _commands({ channelName, username, words }) {
    if (this.userIsChannelOwner(channelName, username)) {
      const eCommandsOn =
        this._config.channel_settings[channelName].ecommands_on;
      const onOrOff = words[0] ? words[0].toLowerCase() : "";
      let message = "";

      if (eCommandsOn) {
        if (onOrOff === "off") {
          this._config.channel_settings[channelName].ecommands_on = false;
          writeConfigJSON(this._config);
          message = "ECommands are now OFF";
        } else if (onOrOff === "on") {
          message = "ECommands are ON";
        } else {
          message = 'Usage: "%commands on|off" ...current status is ON';
        }
      } else {
        if (onOrOff === "on") {
          this._config.channel_settings[channelName].ecommands_on = true;
          writeConfigJSON(this._config);
          message = "ECommands are now ON";
        } else if (onOrOff === "off") {
          message = "ECommands are OFF";
        } else {
          message = 'Usage: "%commands on|off" ...current status is OFF';
        }
      }

      client.say(`#${channelName}`, message);
    }
  }

  _restricted({ channelName, username, words }) {
    if (this.userIsChannelOwner(channelName, username)) {
      const eCommandsRestricted =
        this._config.channel_settings[channelName].ecommands_restricted;
      const onOrOff = words[0] ? words[0].toLowerCase() : "";
      let message = "";

      if (eCommandsRestricted) {
        if (onOrOff === "off") {
          this._config.channel_settings[
            channelName
          ].ecommands_restricted = false;
          writeConfigJSON(this._config);
          message = "Restricted Mode is now OFF";
        } else if (onOrOff === "on") {
          message = "Restricted Mode is ON";
        } else {
          message = 'Usage: "%restricted on|off" ...current status is ON';
        }
      } else {
        if (onOrOff === "on") {
          this._config.channel_settings[
            channelName
          ].ecommands_restricted = true;
          writeConfigJSON(this._config);
          message = "Restricted Mode is now ON";
        } else if (onOrOff === "off") {
          message = "Restricted Mode is OFF";
        } else {
          message = 'Usage: "%restricted on|off" ...current status is OFF';
        }
      }

      client.say(`#${channelName}`, message);
    }
  }

  async _ecount({ channelName, channelID, username, words }) {
    if (
      this.channelECommandsOn(channelName) ||
      (this.channelECommandsOn(channelName) &&
        this.channelIsInRestrictedMode(channelName) &&
        this.userIsChannelOwner(channelName, username))
    ) {
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
    } else {
      this._sayStatusOfChannel(channelName);
    }
  }

  async _ecountuser({ channelName, channelID, username, words }) {
    if (
      this.channelECommandsOn(channelName) ||
      (this.channelECommandsOn(channelName) &&
        this.channelIsInRestrictedMode(channelName) &&
        this.userIsChannelOwner(channelName, username))
    ) {
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
    } else {
      this._sayStatusOfChannel(channelName);
    }
  }

  async _ecountdate({ channelName, channelID, username, words }) {
    if (
      this.channelECommandsOn(channelName) ||
      (this.channelECommandsOn(channelName) &&
        this.channelIsInRestrictedMode(channelName) &&
        this.userIsChannelOwner(channelName, username))
    ) {
      const emoteCode = words[0];
      const dateKey = words[1] ? words[1] : dateToDateKey(Date.now());

      // TODO validate date

      if (this._emoteCodes[channelName].includes(emoteCode)) {
        const emoteID = `${channelID}-${emoteCode}`;

        try {
          let count = await getEmoteCountForDate(emoteID, dateKey);
          if (count !== null) {
            const dateString = dateKeyToDateString(dateKey);
            client.say(
              `#${channelName}`,
              `${emoteCode} used ${count} times on ${dateString}`
            );
          } else {
            client.say(
              `#${channelName}`,
              `No record of ${emoteCode} used on that date (Format is YYYYMMDD)`
            );
          }
        } catch (error) {
          console.log(
            `Error getting count for dateKey: ${dateKey} and emoteID: ${emoteID}`
          );
        }
      }
    } else {
      this._sayStatusOfChannel(channelName);
    }
  }

  async _etopuser({ channelName, channelID, username, words }) {
    if (
      this.channelECommandsOn(channelName) ||
      (this.channelECommandsOn(channelName) &&
        this.channelIsInRestrictedMode(channelName) &&
        this.userIsChannelOwner(channelName, username))
    ) {
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
    } else {
      this._sayStatusOfChannel(channelName);
    }
  }

  async _etopusers({ channelName, channelID, username, words }) {
    // gets top 3 users
    if (
      this.channelECommandsOn(channelName) ||
      (this.channelECommandsOn(channelName) &&
        this.channelIsInRestrictedMode(channelName) &&
        this.userIsChannelOwner(channelName, username))
    ) {
      const emoteCode = words[0];
      if (this._emoteCodes[channelName].includes(emoteCode)) {
        const emoteID = `${channelID}-${emoteCode}`;

        try {
          let topUsers = await getEmoteTopUsers(emoteID);
          if (topUsers && topUsers.length) {
            const topUsersString = topUsers
              .map(
                ({ username, count }, index) =>
                  `${index + 1}. ${username} (${count})`
              )
              .join(" ");
            client.say(
              `#${channelName}`,
              `Top users of ${emoteCode} : ${topUsersString}`
            );
          }
        } catch (error) {
          console.log(`Error getting top user for emoteID: ${emoteID}`);
        }
      }
    } else {
      this._sayStatusOfChannel(channelName);
    }
  }

  async _etopdate({ channelName, channelID, username, words }) {
    if (
      this.channelECommandsOn(channelName) ||
      (this.channelECommandsOn(channelName) &&
        this.channelIsInRestrictedMode(channelName) &&
        this.userIsChannelOwner(channelName, username))
    ) {
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
    } else {
      this._sayStatusOfChannel(channelName);
    }
  }

  userIsChannelOwner(channelName, username) {
    return channelName === username;
  }

  channelIsInRestrictedMode(channelName) {
    return (
      this._config.channel_settings &&
      this._config.channel_settings[channelName] &&
      this._config.channel_settings[channelName].ecommands_restricted
    );
  }

  channelECommandsOn(channelName) {
    return (
      this._config.channel_settings &&
      this._config.channel_settings[channelName] &&
      this._config.channel_settings[channelName].ecommands_on
    );
  }

  _sayStatusOfChannel(channelName) {
    const now = Date.now();
    if (
      now - this._statusMessageCooldownPeriod >
      this._channelLastStatusMessageSent[channelName]
    ) {
      const eCommandsOnOrOff = this._config.channel_settings[channelName]
        .ecommands_on
        ? "ON"
        : "OFF";
      const restrictedModeOnOrOff = this._config.channel_settings[channelName]
        .ecommands_restricted
        ? "ON"
        : "OFF";
      const message = `STATUS: ECommands are ${eCommandsOnOrOff} | Restricted Mode is ${restrictedModeOnOrOff}`;
      client.say(`#${channelName}`, message);
      this._channelLastStatusMessageSent[channelName] = now;
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
    if (token) this._token = token;
    else {
      console.log("Error setting auth token");
    }

    let config = await readConfigJSON();
    if (config) this._config = config;
    console.log(this._config);

    this._emoteCodes = {};
    this._channelNameToChannelID = {};

    // used for cooldown period between status messages
    this._statusMessageCooldownPeriod = 60000;
    this._channelLastStatusMessageSent = {};
    process.env.CHANNELS.split(",").forEach((channelName) => {
      this._channelLastStatusMessageSent[channelName] = 0;
    });

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
        const username = tags.username;
        const userID = tags["user-id"];
        const codes = this._emoteCodes[channelName];

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
