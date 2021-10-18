import { Router } from 'express';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { EmoteFrom7TV, ResponseFrom7TV } from '@ttv-emote-stats/common';

const router = Router();

router.get('/emotes', async (req, res) => {
  if (!req.query || !req.query.name) {
    res.status(400).send("Bad Request: 7TV requires a channel name for emoteset lookup.")
  } else {
    try {
      const { name } = req.query;
      const URL = `https://api.7tv.app/v2/users/${name}/emotes`;
      const { status, data } = await axios.get(URL) as AxiosResponse<ResponseFrom7TV>;

      if (status === 200) {
        const emoteSet: EmoteFrom7TV[] = data;
        if (emoteSet.length) {
          res.status(200).json(emoteSet);
        } else {
          res.sendStatus(204);
        }
      }
    } catch (err: any) {
      if (err.response) {
        const { status, statusText } = err.response;
        res.status(status).send(statusText);
      } else {
        res.status(500).send("Error retrieving emoteset from 7TV API.");
      }      
    }
  }
});

export default router;