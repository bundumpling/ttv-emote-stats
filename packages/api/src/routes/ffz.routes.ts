import { Router } from 'express';
import axios, { AxiosResponse } from 'axios';
import { EmoteFromFFZ, ResponseFromFFZ } from '@ttv-emote-stats/common';

const router = Router();

router.get('/emotes', async (req, res) => {
  if (!req.query || !req.query.id) {
    res.status(400).send("Bad Request: FFZ requires an ID for emoteset lookup.")
  } else {
    try {
      const { id } = req.query;
      const URL = `https://api.frankerfacez.com/v1/room/id/${id}`;
      const response = await axios.get(URL) as AxiosResponse<ResponseFromFFZ>;
      if (response && response.status === 200) {
        const { room, sets } = response.data as ResponseFromFFZ;
        const emoteSet: EmoteFromFFZ[] = sets[room.set].emoticons;
        if (emoteSet.length) {
          res.status(200).json(emoteSet);
        } else {
          res.sendStatus(204);
        }
      } else if (response) {
        res.status(response.status).send(response.statusText);
      } else {
        res.status(500).send("Error retrieving emoteset from FFZ API.");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
});

export default router;