import { EmoteFromTwitch, EmoteFromFFZ, EmoteFromBTTV, EmoteFrom7TV, Emote } from "@ttv-emote-stats/common";
import { ComputedRef } from "vue";

export type ProviderEmoteState = {
  [index: string]: {
    error: boolean;
    loading: boolean;
    success: boolean;
    data:
      | EmoteFromTwitch[]
      | EmoteFromFFZ[]
      | EmoteFromBTTV[]
      | EmoteFrom7TV[];
  };
  ["Twitch"]: {
    error: boolean;
    loading: boolean;
    success: boolean;
    data: EmoteFromTwitch[];
  };
  ["FFZ"]: {
    error: boolean;
    loading: boolean;
    success: boolean;
    data: EmoteFromFFZ[];
  };
  ["BTTV"]: {
    error: boolean;
    loading: boolean;
    success: boolean;
    data: EmoteFromBTTV[];
  };
  ["7TV"]: {
    error: boolean;
    loading: boolean;
    success: boolean;
    data: EmoteFrom7TV[];
  };
}

export interface UseEmotesFromProviders {
  state: ProviderEmoteState;
  resetState: () => void;
  requestProviderEmotes: (channelName: string, channelID: string) => Promise<[void, void, void, void]>;
  providerLoading: (provider: string) => boolean;
  providerSuccess: (provider: string) => boolean;
  providerError: (provider: string) => boolean;
  providerEmoteCount: (provider: string) => number;
  totalEmoteCount: ComputedRef<number>;
  normalizedEmotes: ComputedRef<Emote[]>;
  emotesByCode: ComputedRef<Map<string, Emote[]>>;
  duplicateEmotesByCode: ComputedRef<Map<string, Emote[]>>;
  hasDuplicateEmoteCodes: ComputedRef<boolean>;
}

export declare function useEmotesFromProviders(): UseEmotesFromProviders;

export declare const providerList: string[];