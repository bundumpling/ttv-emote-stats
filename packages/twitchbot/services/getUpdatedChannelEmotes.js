const axios = require("axios");

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

module.exports = { getUpdatedChannelEmotes };
