  import { config } from "dotenv";
  import express from "express";
  import fetch from "node-fetch";
  import { decodeJWT } from "./auth";
  import Routes from "./routes";
  import {
    saveUpdatedEmotes,
    updateCountsFromLog,
    updateCountsFromBot,
    getListOfParsedLogs,
    getChannelEmoteCounts,
    getChannelEmoteCodes,
    getEmoteCount,
    getEmoteUsedBy,
    getEmoteUsedOn,
    getEmoteUsageDetails,
    getEmotesFromDbAndProviders,
    getChannelList,
    loginUser,
  } from "./controller";

  import { corsMiddleware, accessControlMiddleware } from "./middleware";

  // import morgan from "morgan";
  // app.use(morgan("combined"));

  // init dotenv 
  config();
  
  const port = 8081;
  const app = express();

  app.use(corsMiddleware);
  app.use(accessControlMiddleware);

  app.get("/", (_req, res) => res.send("Hello from the API Relay Server!"));

  app.use('/twitch', Routes.TWITCH);

  app.get("/ffz/emotes", (req, res) => {
    const { id } = req.query;
    const URL = `https://api.frankerfacez.com/v1/room/id/${id}`;
    fetch(URL, { method: "GET" })
      .then((response) => {
        console.log(`${response.status} ${URL}`);
        if (!response.ok) {
          throw new Error(
            `Got status code ${response.status} from provider FFZ`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(JSON.stringify(json));
        if (!json.sets[json.room.set].emoticons.length) {
          throw new Error("FFZ does not have any emotes for this channel");
        }
        return res.json(json.sets[json.room.set].emoticons);
      })
      .catch((error) => {
        console.error(error);
        return res.send({ error: error.message });
      });
  });

  app.get("/bttv/emotes", (req, res) => {
    const { id } = req.query;
    const URL = `https://api.betterttv.net/3/cached/users/twitch/${id}`;
    fetch(URL, { method: "GET" })
      .then((response) => {
        console.log(`${response.status} ${URL}`);
        if (!response.ok) {
          throw new Error(
            `Got status code ${response.status} from provider BTTV`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(JSON.stringify(json));
        let emotes = json.channelEmotes.concat(json.sharedEmotes);
        if (!emotes.length) {
          throw new Error("BTTV does not have any emotes for this channel");
        }
        return res.json(emotes);
      })
      .catch((error) => {
        console.error(error);
        return res.send({ error: error.message });
      });
  });

  app.get("/7tv/emotes", (req, res) => {
    const { name } = req.query;
    const URL = `https://api.7tv.app/v2/users/${name}/emotes`;
    fetch(URL, { method: "GET" })
      .then((response) => {
        console.log(`${response.status} ${URL}`);
        if (!response.ok) {
          throw new Error(
            `Got status code ${response.status} from provider 7TV`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(JSON.stringify(json));
        return res.json(json);
      })
      .catch((error) => {
        console.error(error);
        return res.send({ error: error.message });
      });
  });

  app.get("/channels", getChannelList);

  app.get("/channel/:channelName/emoteCounts", getChannelEmoteCounts);
  app.get("/channel/:channelName/emoteCodes", getChannelEmoteCodes);

  app.get("/emote/:emoteID/usageDetails", getEmoteUsageDetails);
  app.get("/emote/:emoteID/count", getEmoteCount);
  app.get("/emote/:emoteID/usedBy", getEmoteUsedBy);
  app.get("/emote/:emoteID/usedOn", getEmoteUsedOn);

  // Protected Endpoints

  app.get(
    "/channel/:channelName/emotesFromDbAndProviders",
    decodeJWT,
    getEmotesFromDbAndProviders
  );

  app.get(
    "/channel/:channelName/listOfParsedLogs",
    decodeJWT,
    getListOfParsedLogs
  );

  app.post(
    "/channel/:channelName/saveUpdatedEmotes",
    express.json({ limit: "10MB" }),
    decodeJWT,
    saveUpdatedEmotes
  );

  app.post(
    "/channel/:channelName/updateCountsFromLog",
    express.json({ limit: "10MB" }),
    decodeJWT,
    updateCountsFromLog
  );

  app.post(
    "/admin/updateCountsFromBot",
    express.json({ limit: "10MB" }),
    decodeJWT,
    updateCountsFromBot
  );

  /* Disabled */
  /* app.post("/auth/register", express.json(), validateCreatedUser, registerUser);
   */

  app.post("/auth/login", express.json(), loginUser);

  app.listen(port, "0.0.0.0", () =>
    console.log(`API Relay Server listening on port ${port}`)
  );

