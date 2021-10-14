import { Router } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import { envConfig } from '@ttv-emote-stats/common';

const router = Router();

const TWITCH_OPTIONS: AxiosRequestConfig = {
  method: "GET",
  headers: {
    "Client-ID": envConfig.twitch.clientId,
    Authorization: envConfig.twitch.authToken,
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
      const response = await axios.get(URL, TWITCH_OPTIONS);
      if (response && response.status === 200 && response.data) {
        const data = response.data.data;
        if (data && data.length) {
          res.status(200).json(data[0]);
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

router.get('/emotes', async (req, res) => {
  if (!req.query || !req.query.id) {
    res.status(400).send("Bad Request: Twitch requires an ID for emoteset lookup.");
  } else {
    try {
      const { id } = req.query;
      const URL = `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${id}`;
      const response = await axios.get(URL, TWITCH_OPTIONS);
      if (response && response.status === 200) {
        const data = response.data;
        if (data.length) {
          res.status(200).json(data);
        } else {
          res.sendStatus(204);
        }
      } else if (response) {
        res.status(response.status).send(response.statusText);
      } else {
        res.status(500).send("Error retrieving emoteset from Twitch API");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err)
    }
  }
});

export default router;