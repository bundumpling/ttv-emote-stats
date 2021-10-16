const axios = require("axios");

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

module.exports = { saveUpdatedChannelEmotes };
