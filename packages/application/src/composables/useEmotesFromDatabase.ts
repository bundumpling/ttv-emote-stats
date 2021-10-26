import { computed, ComputedRef, reactive } from 'vue';
import { Emote, handleAxiosError } from '@ttv-emote-stats/common';
import { UseEmotesFromDatabase, DatabaseEmoteState } from '@/types';
import axios, { AxiosResponse } from 'axios';

const getInitialState = (): DatabaseEmoteState => ({
  error: false,
  loading: false,
  success: false,
  data: []
});

export const useEmotesFromDatabase = (): UseEmotesFromDatabase => {
  const state = reactive<DatabaseEmoteState>(getInitialState());
  function resetState(): void { Object.assign(state, getInitialState()) }

  async function requestDatabaseEmotes(channelName: string) {
    const errorMessage = `Error retrieving emotes from database for channel ${channelName}`;
    try {
      const URL = `http://localhost:8081/channel/${channelName}/emotes`;
      const token = localStorage.getItem("user");
      const headers = {
        headers: { authorization: token },
      };
      const response = await axios.get(URL, headers) as AxiosResponse<Emote[]>;

      if (response.status === 200) {
        state.data = response.data;
        state.success = true;
        state.loading = false;
      } else {
        throw Error(errorMessage);
      }
    } catch (error) {
      state.error = true;
      state.loading = false;
      handleAxiosError(error, errorMessage);
    }
  }

  const emotesByCode: ComputedRef<Map<string, Emote>> = computed(() => {
    const emoteCodeMap: Map<string, Emote> = new Map();
    state.data.forEach((emote: Emote) => {
      emoteCodeMap.set(emote.code, emote);
    })
    return emoteCodeMap;
  })

  return {
    state,
    resetState,
    requestDatabaseEmotes,
    emotesByCode
  }
}