import { computed, ComputedRef, reactive } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { TwitchUserState, UseTwitchUser } from "@/types";
import { UserFromTwitch, handleAxiosError } from '@ttv-emote-stats/common';

const getInitialState = (): TwitchUserState => ({
  loading: false,
  success: false,
  error: false,
  data: null
});

export function useTwitchUser(): UseTwitchUser {
  const state = reactive<TwitchUserState>(getInitialState());
  function resetState(): void { Object.assign(state, getInitialState()); }

  async function requestTwitchUser(username: string) {
    state.loading = true;
    try {
      const URL = `http://localhost:8081/twitch/users?login=${username}`;
      const token = localStorage.getItem("user");
      const headers = {
        headers: { authorization: token },
      };
      const response = await axios.get(
        URL,
        headers
      ) as AxiosResponse<UserFromTwitch>;
      if (response.status === 200) {
        state.data = response.data;
        state.success = true;
        state.loading = false;
        return;
      } else {
        throw Error(`Twitch user ${username} not found!`);
      }
    } catch (error) {
      state.error = true;
      state.loading = false;
      handleAxiosError(
        error,
        `Error retrieving Twitch user informatiom for ${username}`
      );
    }
  }

  const hasChannelData: ComputedRef<boolean> = computed(() => Boolean(state.data));

  const channelName: ComputedRef<string | undefined> = computed(() => {
    if (state.data) {
      return state.data.display_name ?? state.data.login;
    } else {
      return undefined;
    }
  });

  const channelID: ComputedRef<string | undefined> = computed(() => {
    if (state.data) {
      return state.data.id;
    } else {
      return undefined;
    }
  });

  const profileImageURL: ComputedRef<string | undefined> = computed(() =>
    state.data ? state.data.profile_image_url : undefined
  );

  return {
    hasChannelData,
    channelName,
    channelID,
    profileImageURL,
    requestTwitchUser,
    resetState
  }
}