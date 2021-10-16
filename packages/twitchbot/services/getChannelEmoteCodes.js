const axios = require("axios");

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

module.exports = { getChannelEmoteCodes };
