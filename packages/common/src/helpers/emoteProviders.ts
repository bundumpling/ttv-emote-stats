import { EmoteFromBTTV, ResponseFromBTTV } from "../../types";

export function combineBTTVChannelEmotesAndSharedEmotesFromAPIResponse(response: ResponseFromBTTV): EmoteFromBTTV[] {
  const { channelEmotes, sharedEmotes } = response;
  const result: EmoteFromBTTV[] = [];
  
  channelEmotes.forEach(channelEmote => {
    const { id, code, imageType, userId } = channelEmote;
    
    result.push({
      id, code, imageType, userId
    });
  });

  sharedEmotes.forEach(sharedEmote => {
    const { id, code, imageType, user } = sharedEmote;
    const userId = user.id;
    
    result.push({
      id, code, imageType, userId
    });
  });

  return result;
}