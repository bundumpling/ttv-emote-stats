const axios = require("axios");

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

module.exports = { getEmoteTopUser };
