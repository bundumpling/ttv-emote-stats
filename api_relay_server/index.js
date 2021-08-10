require('dotenv').config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = 8081;

app.get("/", (req, res) => res.send("Hello from the API Relay Server!"));

app.get("/twitch/users", (req, res) => {
  if (!req.query || (!req.query.login && !req.query.id)) {
    res.status = 400;
    res.send("Bad Request: Twitch requires either a name or an id for user lookup.");
  } else {
    const { login, id } = req.query;
    const paramsString = login ? "login="+login : "id="+id;
    const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
    const options = {
      method: "GET",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": process.env.TWITCH_AUTH_TOKEN
      }
    }
    fetch(URL, options).then(res => {
      console.log(`${res.status} ${URL}`);
      return res.json()
    }).then(json => {
      console.log(JSON.stringify(json));
      return res.json(json.data[0])
    })
    
  }
})

app.listen(port, () => console.log(`API Relay Server listening on port ${port}`));