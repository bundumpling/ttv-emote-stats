import { reactive, computed, ComputedRef } from 'vue';
import { EmoteFrom7TV, EmoteFromBTTV, EmoteFromFFZ, EmoteFromTwitch, handleAxiosError,
  normalizeEmoteFromTwitch,
  normalizeEmoteFromFFZ,
  normalizeEmoteFromBTTV,
  normalizeEmoteFrom7TV,
  Emote, } from '@ttv-emote-stats/common';
import axios, { AxiosResponse } from 'axios';
import { ProviderEmoteState, UseEmotesFromProviders } from '@/types';

export const providerList = ['Twitch', 'FFZ', 'BTTV', '7TV'];

const getInitialState = (): ProviderEmoteState => ({
    ["Twitch"]: {
      error: false,
      loading: false,
      success: false,
      data: [],
    },
    ["FFZ"]: {
      error: false,
      loading: false,
      success: false,
      data: [],
    },
    ["BTTV"]: {
      error: false,
      loading: false,
      success: false,
      data: [],
    },
    ["7TV"]: {
      error: false,
      loading: false,
      success: false,
      data: [],
    },
  });

export const useEmotesFromProviders = (): UseEmotesFromProviders => {
  const state = reactive(getInitialState());
  function resetState(): void { Object.assign(state, getInitialState()); }

  const token = localStorage.getItem("user");
  const headers = {
    headers: { authorization: token },
  };

  async function getEmotesFromProvider(
    provider: "Twitch" | "FFZ" | "BTTV" | "7TV",
    URL: string,
    errorMessage: string
  ) {
    state[provider].loading = true;
    try {
      const response = (await axios.get(URL, headers)) as AxiosResponse<
        EmoteFromTwitch[] | EmoteFromFFZ[] | EmoteFromBTTV[] | EmoteFrom7TV[]
      >;
      if (response.status === 200) {
        state[provider].data = response.data;
        state[provider].success = true;
        state[provider].loading = false;
      } else {
        throw Error(errorMessage);
      }
    } catch (error) {
      state[provider].error = true;
      state[provider].loading = false;
      handleAxiosError(error, errorMessage);
    }
  }

  async function getTwitchEmotes(channelID: string) {
    const provider = "Twitch";
    const URL = `http://localhost:8081/twitch/emotes?id=${channelID}`;
    const errorMessage = `Error retrieving emote set from Twitch for user id '${channelID}'`;
    return getEmotesFromProvider(provider, URL, errorMessage);
  }

  async function getFFZEmotes(channelID: string) {
    const provider = "FFZ";
    const URL = `http://localhost:8081/ffz/emotes?id=${channelID}`;
    const errorMessage = `Error retrieving emote set from FFZ for user id '${channelID}'`;
    return getEmotesFromProvider(provider, URL, errorMessage);
  }

  async function getBTTVEmotes(channelID: string) {
    const provider = "BTTV";
    const URL = `http://localhost:8081/bttv/emotes?id=${channelID}`;
    const errorMessage = `Error retrieving emote set from BTTV for user id '${channelID}'`;
    return getEmotesFromProvider(provider, URL, errorMessage);
  }

  async function get7TVEmotes(channelName: string) {
    const provider = "7TV";
    const URL = `http://localhost:8081/7tv/emotes?name=${channelName}`;
    const errorMessage = `Error retrieving emote set from 7TV for user '${channelName}'`;
    return getEmotesFromProvider(provider, URL, errorMessage);
  }

  async function requestProviderEmotes(channelName: string, channelID: string) {
    return Promise.all([
      getTwitchEmotes(channelID),
      getFFZEmotes(channelID),
      getBTTVEmotes(channelID),
      get7TVEmotes(channelName)
    ]);
  }

  function providerLoading(providerName: string): boolean {
    return state[providerName].loading;
  }
  function providerSuccess(providerName: string): boolean {
    return state[providerName].success;
  }
  function providerError(providerName: string): boolean {
    return state[providerName].error;
  }
  function providerEmoteCount(providerName: string): number {
    return state[providerName].data.length;
  }

  const totalEmoteCount = computed(() => providerList.reduce((totalCount: number, provider: string) => providerEmoteCount(provider) + totalCount, 0));

  const normalizedEmotes: ComputedRef<Emote[]> = computed(() => {
    const normalizedTwitchEmotes = state["Twitch"].data.map(
      normalizeEmoteFromTwitch
    );
    const normalizedFFZEmotes = state["FFZ"].data.map(
      normalizeEmoteFromFFZ
    );
    const normalizedBTTVEmotes = state["BTTV"].data.map(
      normalizeEmoteFromBTTV
    );
    const normalized7TVEmotes = state["7TV"].data.map(
      normalizeEmoteFrom7TV
    );
    return Array.from([
      ...normalizedTwitchEmotes,
      ...normalizedFFZEmotes,
      ...normalizedBTTVEmotes,
      ...normalized7TVEmotes,
    ]);
  });

  const emotesByCode: ComputedRef<Map<string, Emote[]>> = computed(() => {
    const emoteCodeMap: Map<string, Emote[]> = new Map();

    normalizedEmotes.value.forEach((emote: Emote) => {
      if (emoteCodeMap.has(emote.code)) {
        const currentValue = emoteCodeMap.get(emote.code);
        emoteCodeMap.set(emote.code, [...(currentValue as Emote[]), emote]);
      } else {
        emoteCodeMap.set(emote.code, [emote]);
      }
    });

    // sort by provider in the event of duplicate emote codes
    emoteCodeMap.forEach((v: Emote[], k: string) => {
      if (v.length) {
        emoteCodeMap.set(
          k,
          v.sort(
            (a: Emote, b: Emote) =>
              providerList.indexOf(a.provider) -
              providerList.indexOf(b.provider)
          )
        );
      }
    });

    return emoteCodeMap;
  });

  const duplicateEmotesByCode: ComputedRef<Map<string, Emote[]>> = computed(
    () => {
      return new Map<string, Emote[]>(
        [...emotesByCode.value].filter(([, v]) => v.length > 1)
      );
    }
  );

  const hasDuplicateEmoteCodes: ComputedRef<boolean> = computed(
    () => emotesByCode.value.size < normalizedEmotes.value.length
  );

  return {
    state,
    resetState,
    requestProviderEmotes,
    providerLoading,
    providerSuccess,
    providerError,
    providerEmoteCount,
    totalEmoteCount,
    normalizedEmotes,
    emotesByCode,
    duplicateEmotesByCode,
    hasDuplicateEmoteCodes
  }

}