const axios = require("axios");

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

module.exports = { getEmoteCount };
