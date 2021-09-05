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
        code: emote.name,
        image: emote.images.url_1x,
        provider: 'Twitch',
        providerID: emote.id,
      };
    }
  );
}

export function fromFFZ(state: State): IEmote[] {
  if (!state.providerAPIResults["FFZ"].length) return [];
  return state.providerAPIResults["FFZ"].map(
    (emote: IEmoteFromFFZAPI) => {
      return {
        code: emote.name,
        image: emote.urls["1"],
        provider: 'FFZ',
        providerID: `${emote.id}`,
      };
    }
  );
}

export function fromBTTV(state: State): IEmote[] {
  if (!state.providerAPIResults["BTTV"].length) return [];
  return state.providerAPIResults["BTTV"].map(
    (emote: IEmoteFromBTTVAPI) => {
      return {
        code: emote.code,
        image: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
        provider: 'BTTV',
        providerID: emote.id,
      };
    }
  );
}

export function from7TV(state: State): IEmote[] {
  if (!state.providerAPIResults["7TV"].length) return [];
  return state.providerAPIResults["7TV"].map(
    (emote: IEmoteFrom7TVAPI) => {
      return {
        code: emote.name,
        image: `https://cdn.7tv.app/emote/${emote.id}/1x`,
        provider: '7TV',
        providerID: emote.id,
      };
    }
  );
}