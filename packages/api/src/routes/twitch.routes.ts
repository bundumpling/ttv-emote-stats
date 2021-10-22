import { Router } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseFromTwitchForEmotes, ResponseFromTwitchForUsers, UserFromTwitch } from '@ttv-emote-stats/common';
import { config } from 'dotenv';
import { JSONPostSizeLimiter } from '../middleware';
config({ path: '../../.env'});

const router = Router();

const TWITCH_OPTIONS: AxiosRequestConfig = {
  method: "GET",
  headers: {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: process.env.TWITCH_AUTH_TOKEN
  }
};

router.get('/users', async (req, res) => {
  if (!req.query || (!req.query.login && !req.query.id)) {
    res.status(400).send("Bad Request: Twitch requires either a login (username) or an ID for user lookup.");
  } else {
    try {
      const { login, id } = req.query;
      const paramsString = login ? "login=" + login : "id=" + id;
      const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
      const response = await axios.get(URL, TWITCH_OPTIONS) as AxiosResponse<ResponseFromTwitchForUsers>;
      if (response && response.status === 200) {
        const users = response.data.data;
        if (users && users.length) {
          res.status(200).json(users[0]);
        } else {
          res.sendStatus(204);
        }        
      } else {
        res.status(response.status).send(res.statusMessage);
      }      
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  }
});

router.post('/userbatch', JSONPostSizeLimiter, async (req, res) => {
  if (!req.body || !req.body.paramsString) {
    res.status(400).send("Bad Request: Twitch requires logins (usernames) or IDs for batch user lookup.");
  } else {
    try {
      const { paramsString } = req.body;
      const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
      const response = await axios.get(URL, TWITCH_OPTIONS) as AxiosResponse<ResponseFromTwitchForUsers>
      if (response && response.status === 200) {
        const users = response.data.data;
        if (users && users.length) {
          res.status(200).json(users);
        } else {
          res.sendStatus(204);
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
});

router.get('/emotes', async (req, res) => {
  if (!req.query || !req.query.id) {
    res.status(400).send("Bad Request: Twitch requires an ID for emoteset lookup.");
  } else {
    try {
      const { id } = req.query;
      const URL = `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${id}`;
      const response = await axios.get(URL, TWITCH_OPTIONS) as AxiosResponse<ResponseFromTwitchForEmotes>;
      if (response && response.status === 200) {
        const emoteSet = response.data.data;
        if (emoteSet.length) {
          res.status(200).json(emoteSet);
        } else {
          res.sendStatus(204);
        }
      } else if (response) {
        res.status(response.status).send(response.statusText);
      } else {
        res.status(500).send("Error retrieving emoteset from Twitch API.");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err)
    }
  }
});

export default router;