const axios = require("axios");
const { dateKeyToDateString } = require("../helpers/date");

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

module.exports = { getEmoteTopDate };
