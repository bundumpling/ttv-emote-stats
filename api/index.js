(async () => {
  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  // const morgan = require("morgan");
  const fetch = require("node-fetch");
  const port = 8081;
  const app = express();

  // app.use(morgan("combined"));

  const { connectToDb } = require("./db");
  const db = await connectToDb();

  const {
    saveUpdatedEmotes,
    updateCountsFromLog,
    updateCountsFromBot,
    getChannelEmoteCounts,
    getChannelEmoteCodes,
    getEmoteCount,
    getEmoteUsedBy,
    getEmoteUsageDetails,
    getChannelEmotesFromDatabaseAndProviders,
    getChannelList,
    loginUser,
  } = require("./controller");

  const { decodeJWT } = require("./auth");

  app.use(
    cors({
      origin: ["http://localhost:8080", "172.17.144.1"],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );

  const TWITCH_OPTIONS = {
    method: "GET",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      Authorization: process.env.TWITCH_AUTH_TOKEN,
    },
  };

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
  });

  app.get("/", (req, res) => res.send("Hello from the API Relay Server!"));

  app.get("/twitch/users", (req, res) => {
    if (!req.query || (!req.query.login && !req.query.id)) {
      res.status = 400;
      res.send(
        "Bad Request: Twitch requires either a name or an id for user lookup."
      );
    } else {
      const { login, id } = req.query;
      const paramsString = login ? "login=" + login : "id=" + id;
      const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
      fetch(URL, TWITCH_OPTIONS)
        .then((res) => {
          console.log(`${res.status} ${URL}`);
          return res.json();
        })
        .then((json) => {
          console.log(JSON.stringify(json));
          return res.json(json.data[0]);
        });
    }
  });

  app.get("/twitch/emotes", (req, res) => {
    const { id } = req.query;
    const URL = `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${id}`;
    fetch(URL, TWITCH_OPTIONS)
      .then((response) => {
        console.log(`${response.status} ${URL}`);
        if (!response.ok) {
          throw new Error(
            `Got status code ${response.status} from provider Twitch`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(JSON.stringify(json));
        if (!json.data.length) {
          throw new Error(`Twitch does not have any emotes for this channel`);
        }
        return res.json(json.data);
      })
      .catch((error) => {
        console.error(error);
        return res.send({ error: error.message });
      });
  });

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

  app.get("/channel/:channelName/emoteCounts", (req, res) =>
    getChannelEmoteCounts(req, res, db)
  );

  app.get("/channel/:channelName/emoteCodes", (req, res) =>
    getChannelEmoteCodes(req, res, db)
  );

  app.get(
    "/channel/:channelName/getChannelEmotesFromDatabaseAndProviders",
    (req, res) => getChannelEmotesFromDatabaseAndProviders(req, res, db)
  );

  app.get("/emote/:emoteID/usageDetails", (req, res) =>
    getEmoteUsageDetails(req, res, db)
  );

  app.get("/emote/:emoteID/count", getEmoteCount);
  app.get("/emote/:emoteID/usedBy", getEmoteUsedBy);

  app.get("/channel/:channelName/listofParsedLogFilesnames", (req, res) => {
    const channelName = req.params.channelName;
    db.collection("TwitchLogin").findOne(
      { _id: channelName },
      (err, { twitchID }) => {
        db.collection("Channel").findOne(
          { _id: twitchID },
          (err, channelData) => {
            res.send(JSON.stringify(channelData.parsedLogfiles));
          }
        );
      }
    );
  });

  app.post(
    "/channel/:channelName/saveUpdatedEmotes",
    express.json({ limit: "10MB" }),
    (req, res) => saveUpdatedEmotes(req, res, db)
  );

  app.post(
    "/channel/:channelName/updateCountsFromLog",
    express.json({ limit: "10MB" }),
    (req, res) => updateCountsFromLog(req, res, db)
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

  app.get("/admin/getChannelList", decodeJWT, getChannelList);

  app.listen(port, "0.0.0.0", () =>
    console.log(`API Relay Server listening on port ${port}`)
  );
})();
