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
  app.use('/ffz', Routes.FFZ); 
  app.use('/bttv', Routes.BTTV);
  app.use('/7tv', Routes.SEVENTV);

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

