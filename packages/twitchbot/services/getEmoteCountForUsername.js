const axios = require("axios");

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

module.exports = { getEmoteCountForUsername };
