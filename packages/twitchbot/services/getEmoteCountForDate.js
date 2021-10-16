const axios = require("axios");

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

module.exports = { getEmoteCountForDate };
