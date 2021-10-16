const axios = require("axios");
const client = require("../client");

const Services = require("../services");
const { dateToDateKey, dateKeyToDateString } = require("../helpers/date");
const { readConfigJSON, writeConfigJSON } = require("../helpers/config");

class MessageHandler {
  constructor() {
    this._commands = {
      "%commands": { method: this._commands, ownerOnly: false },
      "%ecount": { method: this._ecount, ownerOnly: false },
      "%ecountuser": { method: this._ecountuser, ownerOnly: false },
      "%ecountdate": { method: this._ecountdate, ownerOnly: false },
      "%etopuser": { method: this._etopuser, ownerOnly: false },
      "%etopusers": { method: this._etopusers, ownerOnly: false },
      "%etopdate": { method: this._etopdate, ownerOnly: false },
      "%update": { method: this._update, ownerOnly: true, bypassMode: true },
      "%mode": { method: this._mode, ownerOnly: true, bypassMode: true },
    };

    this._config = {};
    this._token = null;
    this._modes = ["NORMAL", "RESTRICTED", "DISABLED", "SILENT"];
  }

  _commandCanProceed({ channelName, username, command, channelMode }) {
    const isOwnerOnlyCommand = this._commands[command].ownerOnly;
    const userIsChannelOwner = this.userIsChannelOwner(channelName, username);
    const bypassMode = this._commands[command].bypassMode;

    switch (channelMode) {
      case "NORMAL":
        if (isOwnerOnlyCommand) {
          if (userIsChannelOwner) {
            return true;
          } else {
            client.say(
              `#${channelName}`,
              `Command '${command}' is only usable by the channel owner.`
            );
            return false;
          }
        } else {
          return true;
        }

      case "RESTRICTED":
        if (userIsChannelOwner) {
          return true;
        } else if (isOwnerOnlyCommand) {
          client.say(
            `#${channelName}`,
            `Command '${command}' is only usable by the channel owner.`
          );
          return false;
        } else {
          client.say(
            `#${channelName}`,
            `In Restricted mode. Only the channel owner may use commands.`
          );
          return false;
        }

      case "DISABLED":
        if (bypassMode) {
          return userIsChannelOwner;
        } else if (userIsChannelOwner) {
          const availableCommands = Object.keys(this._commands).filter(
            (command) => this._commands[command].bypassMode
          );
          client.say(
            `#${channelName}`,
            `In Disabled mode. Channel owner can use commands: ${availableCommands.join(
              " "
            )}`
          );
          return false;
        } else {
          client.say(`#${channelName}`, `Commands Disabled.`);
          return false;
        }

      case "SILENT":
        return userIsChannelOwner && bypassMode;

      default:
        return false;
    }
  }

  async _mode({ channelName, username, words, channelMode }) {
    const infoMessage = `Current mode is ${
      channelMode ?? this._modes[0]
    }. Set mode with '%mode ${this._modes.join(" | ")}'`;

    if (!words[0] || !this._modes.includes(words[0].toUpperCase())) {
      client.say(`#${channelName}`, infoMessage);
    } else {
      const newMode = words[0].toUpperCase();
      this._config.channel_settings[channelName].mode = newMode;
      writeConfigJSON(this._config);
      client.say(`#${channelName}`, `Mode set to ${newMode}`);
    }
  }

  async _update({ channelName, username, channelID }) {
    let message;

    try {
      const updatedEmotes = await Services.getUpdatedChannelEmotes(
        channelName,
        this._token
      );
      const success = await Services.saveUpdatedChannelEmotes(
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

        try {
          client.say(`#${channelName}`, message);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  _commands({ channelName, username }) {
    // Add channel msg with link to command list
  }

  async _ecount({ channelName, channelID, username, words }) {
    const emoteCode = words[0];
    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let count = await Services.getEmoteCount(emoteID);
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
        let count = await Services.getEmoteCountForUsername(emoteID, username);
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

  async _ecountdate({ channelName, channelID, username, words }) {
    const emoteCode = words[0];
    const dateKey = words[1] ? words[1] : dateToDateKey(Date.now());

    // TODO validate date

    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let count = await Services.getEmoteCountForDate(emoteID, dateKey);
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
  }

  async _etopuser({ channelName, channelID, username, words }) {
    const emoteCode = words[0];
    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let topUser = await Services.getEmoteTopUser(emoteID);
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

  async _etopusers({ channelName, channelID, username, words }) {
    // gets top 3 users
    const emoteCode = words[0];
    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let topUsers = await Services.getEmoteTopUsers(emoteID);
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
  }

  async _etopdate({ channelName, channelID, username, words }) {
    const emoteCode = words[0];
    if (this._emoteCodes[channelName].includes(emoteCode)) {
      const emoteID = `${channelID}-${emoteCode}`;

      try {
        let topDate = await Services.getEmoteTopDate(emoteID);
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

  userIsChannelOwner(channelName, username) {
    return channelName === username;
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
      token = await Services.login();
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
        const { emoteCodes, channelID } = await Services.getChannelEmoteCodes(
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
        const command = words[0];
        const channelMode =
          this._config.channel_settings[channelName].mode ?? this._modes[0]; // Default to normal mode

        if (
          this._commands.hasOwnProperty(command) &&
          this._commandCanProceed({
            channelName,
            username,
            command,
            channelMode,
          })
        ) {
          const args = {
            channelName,
            channelID: this._channelNameToChannelID[channelName],
            username,
            userID,
            channelMode,
            words: words.slice(1),
          };
          this._commands[command].method.apply(this, [args]);
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
