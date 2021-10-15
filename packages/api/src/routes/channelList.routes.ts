import { Router } from 'express';
import * as ChannelListController from '../controllers/channelList';

const router = Router();

router.get('/', ChannelListController.getChannelList)

export default router;