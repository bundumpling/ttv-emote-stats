import {
  IEmoteFromTwitchAPI,
  IEmoteFromFFZAPI,
  IEmoteFromBTTVAPI,
  IEmoteFrom7TVAPI,
  IEmote
} from "../types";

import { State } from "../store";

export function fromTwitch(state: State): IEmote[] {
  if (!state.providerAPIResults["Twitch"].length) return [];
  return state.providerAPIResults["Twitch"].map(
    (emote: IEmoteFromTwitchAPI) => {
      return {
        id: emote.id,
        name: emote.name,
        image: emote.images.url_1x,
        provider: 'Twitch',
        count: 0,
        usedBy: {}
      };
    }
  );
}

export function fromFFZ(state: State): IEmote[] {
  if (!state.providerAPIResults["FFZ"].length) return [];
  return state.providerAPIResults["FFZ"].map(
    (emote: IEmoteFromFFZAPI) => {
      return {
        id: `${emote.id}`,
        name: emote.name,
        image: emote.urls["1"],
        provider: 'FFZ',
        count: 0,
        usedBy: {}
      };
    }
  );
}

export function fromBTTV(state: State): IEmote[] {
  if (!state.providerAPIResults["BTTV"].length) return [];
  return state.providerAPIResults["BTTV"].map(
    (emote: IEmoteFromBTTVAPI) => {
      return {
        id: emote.id,
        name: emote.code,
        image: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
        provider: 'BTTV',
        count: 0,
        usedBy: {}
      };
    }
  );
}

export function from7TV(state: State): IEmote[] {
  if (!state.providerAPIResults["7TV"].length) return [];
  return state.providerAPIResults["7TV"].map(
    (emote: IEmoteFrom7TVAPI) => {
      return {
        id: emote.id,
        name: emote.name,
        image: `https://cdn.7tv.app/emote/${emote.id}/1x`,
        provider: '7TV',
        count: 0,
        usedBy: {}
      };
    }
  );
}