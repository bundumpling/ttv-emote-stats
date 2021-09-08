require('dotenv').config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = 8081;


const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';

const dbName = 'TTVEmoteStats';

const { updateChannelEmotes, updateCountsFromLog, getChannelData, getEmoteUsedByCounts } = require("./controller");

let db = null;

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error(err);
  }
  db = client.db(dbName);
  console.log("Successfully connected to MongoDB");
});

const TWITCH_OPTIONS = {
  method: "GET",
  headers: {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    "Authorization": process.env.TWITCH_AUTH_TOKEN
  }
};

app.use(function(req, res, next) {
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
    res.send("Bad Request: Twitch requires either a name or an id for user lookup.");
  } else {
    const { login, id } = req.query;
    const paramsString = login ? "login="+login : "id="+id;
    const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
    fetch(URL, TWITCH_OPTIONS).then(res => {
      console.log(`${res.status} ${URL}`);
      return res.json();
    }).then(json => {
      console.log(JSON.stringify(json));
      return res.json(json.data[0]);
    })
  }
})

app.get("/twitch/emotes", (req, res) => {
  const { id } = req.query;
  const URL = `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${id}`;
  fetch(URL, TWITCH_OPTIONS).then(response => {
    console.log(`${response.status} ${URL}`);
    if (!response.ok) {
      throw new Error(`Got status code ${response.status} from provider Twitch`);
    }
    return response.json();
  }).then(json => {
    console.log(JSON.stringify(json));
    if (!json.data.length) {
      throw new Error(`Twitch does not have any emotes for this channel`);
    }
    return res.json(json.data);
  }).catch(error => {
    console.error(error)
    return res.send({ error: error.message });
  })
})

app.get("/ffz/emotes", (req, res) => {
  const { id } = req.query;
  const URL = `https://api.frankerfacez.com/v1/room/id/${id}`;
  fetch(URL, { method: 'GET' }).then(response => {
    console.log(`${response.status} ${URL}`);
    if (!response.ok) {
      throw new Error(`Got status code ${response.status} from provider FFZ`);
    }
    return response.json();
  }).then(json => {
    console.log(JSON.stringify(json));
    if (!json.sets[json.room.set].emoticons.length){
      throw new Error('FFZ does not have any emotes for this channel');
    }
    return res.json(json.sets[json.room.set].emoticons);
  }).catch(error => {
    console.error(error)
    return res.send({ error: error.message });
  })
})

app.get("/bttv/emotes", (req, res) => {
  const { id } = req.query;
  const URL = `https://api.betterttv.net/3/cached/users/twitch/${id}`;
  fetch(URL, { method: 'GET' }).then(response => {
    console.log(`${response.status} ${URL}`);
    if (!response.ok) {
      throw new Error(`Got status code ${response.status} from provider BTTV`);
    }
    return response.json();
  }).then(json => {
    console.log(JSON.stringify(json));
    let emotes = json.channelEmotes.concat(json.sharedEmotes);
    if (!emotes.length) {
      throw new Error('BTTV does not have any emotes for this channel');
    }
    return res.json(emotes);
  }).catch(error => {
    console.error(error)
    return res.send({ error: error.message });
  })
})

app.get("/7tv/emotes", (req, res) => {
  const { name } = req.query;
  const URL = `https://api.7tv.app/v2/users/${name}/emotes`;
  fetch(URL, { method: 'GET' }).then(response => {
    console.log(`${response.status} ${URL}`);
    if (!response.ok) {
      throw new Error(`Got status code ${response.status} from provider 7TV`);
    }
    return response.json();
  }).then(json => {
    console.log(JSON.stringify(json));
    return res.json(json)
  }).catch(error => {
    console.error(error)
    return res.send({ error: error.message });
  })
})

app.get("/channel/:channelName", (req, res) => getChannelData(req, res, db))

app.post("/channel/:channelName/update", express.json(), (req, res) => {
  const channelName = req.params.channelName;
  const channelID = req.body.channelID;
  const emotes = req.body.emotes;

  updateChannelEmotes(db, channelName, channelID, emotes).then((error, result) => {
    if (error) {
      console.error(error);
      res.send({ ok: false })
    } else {
      res.send({ ok: true })
    }
  });
})

app.get("/emote/:emoteID/usedBy", (req, res) => getEmoteUsedByCounts(req, res, db))

app.get("/channel/:channelName/listofParsedLogFilesnames", (req, res) => {
  const channelName = req.params.channelName;
  db.collection('TwitchLogin').findOne({ login: channelName }, (err, { twitchID }) => {
    db.collection('Channel').findOne({ _id: twitchID }, (err, channelData) => {
        res.send(JSON.stringify(channelData.parsedLogfiles));
      
    })
  })
})

app.post("/channel/:channelName/updateCountsFromLog", express.json({ limit: '10MB' }), (req, res) => updateCountsFromLog(req, res, db));

app.listen(port, () => console.log(`API Relay Server listening on port ${port}`));