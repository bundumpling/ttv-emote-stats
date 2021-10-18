import { EmoteFromTwitch, EmoteFromFFZ, EmoteFromBTTV, EmoteFrom7TV, Emote } from "@ttv-emote-stats/common";

export const fromTwitch = (emote: EmoteFromTwitch): Emote => ({
  code: emote.name,
  image: emote.images.url_1x,
  provider: "Twitch",
  providerID: emote.id,
  obsolete: false
})

export const fromFFZ = (emote: EmoteFromFFZ): Emote => ({
  code: emote.name,
  image: emote.urls["1"],
  provider: "FFZ",
  providerID: `${emote.id}`,
  obsolete: false
})

export const fromBTTV = (emote: EmoteFromBTTV): Emote => ({
  code: emote.code,
  image: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
  provider: "BTTV",
  providerID: emote.id,
  obsolete: false
})

export const from7TV = (emote: EmoteFrom7TV): Emote => ({
  code: emote.name,
  image: `https://cdn.7tv.app/emote/${emote.id}/1x`,
  provider: "7TV",
  providerID: emote.id,
  obsolete: false
})