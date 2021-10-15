import twitchRoutes from './twitch.routes';
import ffzRoutes from './ffz.routes';
import bttvRoutes from './bttv.routes';
import seventvRoutes from './7tv.routes';
import channelListRoutes from './channelList.routes';
import channelRoutes from './channel.routes';

export default {
  Twitch: twitchRoutes,
  FFZ: ffzRoutes,
  BTTV: bttvRoutes,
  SevenTV: seventvRoutes,
  ChannelList: channelListRoutes,
  Channel: channelRoutes
}