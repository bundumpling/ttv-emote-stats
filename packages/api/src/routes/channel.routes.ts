import { Router } from 'express';
import { JSONPostSizeLimiter } from '../middleware';
import * as Auth from '../auth';
import * as ChannelController from "../controllers/channel";

const router = Router();

// Routes

router.get("/:channelName/emoteCounts", ChannelController.getChannelEmoteCounts);
router.get("/:channelName/emoteCodes", ChannelController.getChannelEmoteCodes);

// Protected Routes

router.get(
  "/:channelName/emotesFromDbAndProviders",
  Auth.decodeJWT,
  ChannelController.getEmotesFromDbAndProviders
);

router.get(
  "/:channelName/listOfParsedLogs",
  Auth.decodeJWT,
  ChannelController.getListOfParsedLogs
);

router.post(
  "/:channelName/saveUpdatedEmotes",
  JSONPostSizeLimiter,
  Auth.decodeJWT,
  ChannelController.saveUpdatedEmotes
);

router.post(
  "/:channelName/updateCountsFromLog",
  JSONPostSizeLimiter,
  Auth.decodeJWT,
  ChannelController.updateCountsFromLog
);

export default router;