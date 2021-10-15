  import express from "express";
  import * as Auth from "./auth";
  import Routes from "./routes";
  import * as Controller from "./controller";
  import { corsMiddleware, accessControlMiddleware } from "./middleware";
  import { envConfig } from "@ttv-emote-stats/common";

  // import morgan from "morgan";
  // app.use(morgan("combined"));
  
  const port = envConfig.serverPort;
  const app = express();

  app.use(corsMiddleware);
  app.use(accessControlMiddleware);

  app.get("/", (_req, res) => res.send("Hello from the API Relay Server!"));

  app.use('/twitch', Routes.TWITCH);
  app.use('/ffz', Routes.FFZ); 
  app.use('/bttv', Routes.BTTV);
  app.use('/7tv', Routes.SEVENTV);

  app.get("/channels", Controller.getChannelList);

  app.get("/channel/:channelName/emoteCounts", Controller.getChannelEmoteCounts);
  app.get("/channel/:channelName/emoteCodes", Controller.getChannelEmoteCodes);

  app.get("/emote/:emoteID/usageDetails", Controller.getEmoteUsageDetails);
  app.get("/emote/:emoteID/count", Controller.getEmoteCount);
  app.get("/emote/:emoteID/usedBy", Controller.getEmoteUsedBy);
  app.get("/emote/:emoteID/usedOn", Controller.getEmoteUsedOn);

  // Protected Endpoints

  app.get(
    "/channel/:channelName/emotesFromDbAndProviders",
    Auth.decodeJWT,
    Controller.getEmotesFromDbAndProviders
  );

  app.get(
    "/channel/:channelName/listOfParsedLogs",
    Auth.decodeJWT,
    Controller.getListOfParsedLogs
  );

  app.post(
    "/channel/:channelName/saveUpdatedEmotes",
    express.json({ limit: "10MB" }),
    Auth.decodeJWT,
    Controller.saveUpdatedEmotes
  );

  app.post(
    "/channel/:channelName/updateCountsFromLog",
    express.json({ limit: "10MB" }),
    Auth.decodeJWT,
    Controller.updateCountsFromLog
  );

  app.post(
    "/admin/updateCountsFromBot",
    express.json({ limit: "10MB" }),
    Auth.decodeJWT,
    Controller.updateCountsFromBot
  );

  /* Disabled */
  /* app.post("/auth/register", express.json(), validateCreatedUser, Controller.registerUser);
   */

  app.post("/auth/login", express.json(), Controller.loginUser);

  app.listen(port, "0.0.0.0", () =>
    console.log(`API Relay Server listening on port ${port}`)
  );

