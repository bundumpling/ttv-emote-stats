const axios = require("axios");

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

module.exports = { getEmoteTopUsers };
