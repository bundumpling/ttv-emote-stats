require('dotenv').config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = 8081;

const TWITCH_OPTIONS = {
  method: "GET",
  headers: {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    "Authorization": process.env.TWITCH_AUTH_TOKEN
  }
};

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
  fetch(URL, TWITCH_OPTIONS).then(res => {
    console.log(`${res.status} ${URL}`);
    return res.json();
  }).then(json => {
    console.log(JSON.stringify(json));
    return res.json(json.data);
  })
})

app.get("/ffz/emotes", (req, res) => {
  const { id } = req.query;
  const URL = `https://api.frankerfacez.com/v1/room/id/${id}`;
  fetch(URL, { method: 'GET' }).then(res => {
    console.log(`${res.status} ${URL}`);
    return res.json();
  }).then(json => {
    console.log(JSON.stringify(json));
    return res.json(json.sets[json.room.set].emoticons);
  })
})

app.get("/bttv/emotes", (req, res) => {
  const { id } = req.query;
  const URL = `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${id}`;
  fetch(URL, { method: 'GET' }).then(res => {
    console.log(`${res.status} ${URL}`);
    return res.json();
  }).then(json => {
    console.log(JSON.stringify(json));
    return res.json(json);
  })
})

app.listen(port, () => console.log(`API Relay Server listening on port ${port}`));