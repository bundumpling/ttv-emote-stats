import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/emotes', async (req, res) => {
  if (!req.query || !req.query.id) {
    res.status(400).send("Bad Request: BTTV requires an ID for emoteset lookup.")
  } else {
    try {
      const { id } = req.query;
      const URL = `https://api.betterttv.net/3/cached/users/twitch/${id}`;
      const response = await axios.get(URL);
      if (response && response.status === 200) {
        const { channelEmotes, sharedEmotes } = response.data;
        const emoteSet = channelEmotes.concat(sharedEmotes);
        if (emoteSet.length) {
          res.status(200).json(emoteSet);
        } else {
          res.sendStatus(204);
        }
      } else if (response) {
        res.status(response.status).send(response.statusText);
      } else {
        res.status(500).send("Error retrieving emoteset from BTTV API.");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
});

export default router;