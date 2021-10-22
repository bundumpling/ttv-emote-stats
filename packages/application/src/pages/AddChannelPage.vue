<template>
  <AdminTopBar />
  <TheSubheader msg="Add Channel" />
  <FindChannelForm
    v-if="!isDone"
    :value="channelNameInput"
    :update-value="updateChannelNameInput"
    :submit-handler="submitFindChannelForm"
    :submit-disabled="isLoading || !channelNameInput.trim().length"
  />
  <SaveResetControls
    v-else
    :save-disabled="isFailed || isSaving || isSaved || saveFailed"
    :reset-disabled="isSaving"
    :save-handler="save"
    :reset-handler="resetState"
  />
  <EmotesFromProvidersSummary
    v-if="hasChannelData"
    :channel-name="channelName"
    :profile-image-u-r-l="profileImageURL"
    :provider-list="providerList"
    :provider-loading="providerLoading"
    :provider-success="providerSuccess"
    :provider-error="providerError"
    :provider-emote-count="providerEmoteCount"
    :total-emote-count="totalEmoteCount"
    :total-unique-emote-codes="totalEmoteCount - duplicateEmotesByCode.size"
  />
  <DuplicateEmoteCodesSummary
    v-if="hasDuplicateEmoteCodes"
    :duplicate-emotes-by-code="duplicateEmotesByCode"
    :provider-list="providerList"
  />
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  UserFromTwitch,
  EmoteFromTwitch,
  EmoteFromFFZ,
  EmoteFromBTTV,
  EmoteFrom7TV,
  Emote,
  normalizeEmoteFromTwitch,
  normalizeEmoteFromFFZ,
  normalizeEmoteFromBTTV,
  normalizeEmoteFrom7TV,
} from "@ttv-emote-stats/common";
import { defineComponent, ref, reactive, computed, ComputedRef } from "vue";
import AdminTopBar from "@/components/AdminTopBar.vue";
import TheSubheader from "@/components/TheSubheader.vue";
import FindChannelForm from "@/components/FindChannelForm.vue";
import SaveResetControls from "@/components/SaveResetControls.vue";
import EmotesFromProvidersSummary from "@/components/EmotesFromProvidersSummary.vue";
import DuplicateEmoteCodesSummary from "@/components/DuplicateEmoteCodesSummary.vue";

export default defineComponent({
  name: "AddChannelPage",
  components: {
    AdminTopBar,
    TheSubheader,
    FindChannelForm,
    SaveResetControls,
    EmotesFromProvidersSummary,
    DuplicateEmoteCodesSummary,
  },
  setup() {
    const channelNameInput = ref("");

    function updateChannelNameInput(value: string): void {
      channelNameInput.value = value;
    }

    const providerList = ["Twitch", "FFZ", "BTTV", "7TV"];

    interface State {
      [index: string]: unknown;
      channel: {
        error: boolean;
        loading: boolean;
        success: boolean;
        data: UserFromTwitch | null;
      };
      normalizedEmotes: Emote[];
      emotesFromProviders: {
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
      };
    }

    const getInitialState = (): State => ({
      channel: {
        error: false,
        loading: false,
        success: false,
        data: null,
      },
      normalizedEmotes: [],
      emotesFromProviders: {
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
      },
    });

    async function resetState() {
      Object.assign(state, getInitialState());
      isLoading.value = false;
      isDone.value = false;
      isFailed.value = false;
      isSaving.value = false;
      isSaved.value = false;
      saveFailed.value = false;
      channelNameInput.value = "";
    }

    const state = reactive<State>(getInitialState());
    const isLoading = ref(false);
    const isDone = ref(false);
    const isFailed = ref(false);
    const isSaving = ref(false);
    const isSaved = ref(false);
    const saveFailed = ref(false);

    const emotesByCode: ComputedRef<Map<string, Emote[]>> = computed(() => {
      const emoteCodeMap: Map<string, Emote[]> = new Map();

      state.normalizedEmotes.forEach((emote: Emote) => {
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
      () => emotesByCode.value.size < state.normalizedEmotes.length
    );

    function providerLoading(providerName: string): boolean {
      return state.emotesFromProviders[providerName].loading;
    }
    function providerSuccess(providerName: string): boolean {
      return state.emotesFromProviders[providerName].success;
    }
    function providerError(providerName: string): boolean {
      return state.emotesFromProviders[providerName].error;
    }
    function providerEmoteCount(providerName: string): number {
      return state.emotesFromProviders[providerName].data.length;
    }

    const hasChannelData = computed(() => state.channel.data);

    const channelName = computed(() => {
      if (state.channel.data) {
        return state.channel.data.display_name ?? state.channel.data.login;
      } else {
        return channelNameInput.value;
      }
    });

    const profileImageURL = computed(() =>
      state.channel.data ? state.channel.data.profile_image_url : undefined
    );

    const totalEmoteCount = computed(() => {
      let result = 0;
      providerList.forEach((providerName: string) => {
        result += providerEmoteCount(providerName);
      });

      return result;
    });

    const token = localStorage.getItem("user");
    const headers = {
      headers: { authorization: token },
    };

    function handleAxiosError(error: unknown, errorMessage: string) {
      const { response } = error as AxiosError;
      if (response) {
        const { status, statusText } = response;
        throw Error(`${status}: ${statusText} | ${errorMessage}`);
      } else {
        console.log(errorMessage);
        throw error;
      }
    }

    async function findTwitchChannel(): Promise<UserFromTwitch | undefined> {
      state.channel.loading = true;
      try {
        const URL = `http://localhost:8081/twitch/users?login=${channelNameInput.value}`;
        const response = (await axios.get(
          URL,
          headers
        )) as AxiosResponse<UserFromTwitch>;
        if (response.status === 200) {
          state.channel.data = response.data;
          state.channel.success = true;
          state.channel.loading = false;
          return response.data;
        } else {
          throw Error(`Twitch user ${channelNameInput.value} not found!`);
        }
      } catch (error) {
        state.channel.error = true;
        state.channel.loading = false;
        handleAxiosError(
          error,
          `Error retrieving Twitch user informatiom for ${channelNameInput.value}`
        );
      }
    }

    async function getEmotesFromProvider(
      provider: "Twitch" | "FFZ" | "BTTV" | "7TV",
      URL: string,
      errorMessage: string
    ) {
      state.emotesFromProviders[provider].loading = true;
      try {
        const response = (await axios.get(URL, headers)) as AxiosResponse<
          EmoteFromTwitch[] | EmoteFromFFZ[] | EmoteFromBTTV[] | EmoteFrom7TV[]
        >;
        if (response.status === 200) {
          state.emotesFromProviders[provider].data = response.data;
          state.emotesFromProviders[provider].success = true;
          state.emotesFromProviders[provider].loading = false;
        } else {
          throw Error(errorMessage);
        }
      } catch (error) {
        state.emotesFromProviders[provider].error = true;
        state.emotesFromProviders[provider].loading = false;
        handleAxiosError(error, errorMessage);
      }
    }

    async function getTwitchEmotes(twitchID: string) {
      const provider = "Twitch";
      const URL = `http://localhost:8081/twitch/emotes?id=${twitchID}`;
      const errorMessage = `Error retrieving emote set from Twitch for user id '${twitchID}'`;
      return getEmotesFromProvider(provider, URL, errorMessage);
    }

    async function getFFZEmotes(twitchID: string) {
      const provider = "FFZ";
      const URL = `http://localhost:8081/ffz/emotes?id=${twitchID}`;
      const errorMessage = `Error retrieving emote set from FFZ for user id '${twitchID}'`;
      return getEmotesFromProvider(provider, URL, errorMessage);
    }

    async function getBTTVEmotes(twitchID: string) {
      const provider = "BTTV";
      const URL = `http://localhost:8081/bttv/emotes?id=${twitchID}`;
      const errorMessage = `Error retrieving emote set from BTTV for user id '${twitchID}'`;
      return getEmotesFromProvider(provider, URL, errorMessage);
    }

    async function get7TVEmotes() {
      const provider = "7TV";
      const name = state.channel.data
        ? state.channel.data.login
        : channelNameInput.value;
      const URL = `http://localhost:8081/7tv/emotes?name=${name}`;
      const errorMessage = `Error retrieving emote set from 7TV for user '${name}'`;
      return getEmotesFromProvider(provider, URL, errorMessage);
    }

    async function submitFindChannelForm() {
      isLoading.value = true;
      return findTwitchChannel()
        .then((data) => {
          const twitchID = data?.id;
          if (twitchID) {
            return Promise.all([
              getTwitchEmotes(twitchID),
              getFFZEmotes(twitchID),
              getBTTVEmotes(twitchID),
              get7TVEmotes(),
            ]);
          } else {
            isFailed.value = true;
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(async () => {
          isLoading.value = false;
          isDone.value = true;
          state.normalizedEmotes = await buildNormalizedEmoteSet();
        });
    }

    async function buildNormalizedEmoteSet() {
      let result: Emote[] = [];
      const normalizedTwitchEmotes = state.emotesFromProviders[
        "Twitch"
      ].data.map(normalizeEmoteFromTwitch);
      const normalizedFFZEmotes = state.emotesFromProviders["FFZ"].data.map(
        normalizeEmoteFromFFZ
      );
      const normalizedBTTVEmotes = state.emotesFromProviders["BTTV"].data.map(
        normalizeEmoteFromBTTV
      );
      const normalized7TVEmotes = state.emotesFromProviders["7TV"].data.map(
        normalizeEmoteFrom7TV
      );
      return result.concat([
        ...normalizedTwitchEmotes,
        ...normalizedFFZEmotes,
        ...normalizedBTTVEmotes,
        ...normalized7TVEmotes,
      ]);
    }

    function createEmotesArrayForSave(): Emote[] {
      return Array.from(emotesByCode.value.values()).map(
        (emotes: Emote[]) => emotes[0]
      );
    }

    async function save() {
      isSaving.value = true;
      console.log("Saving channel to DB...");
      const channelName = state.channel.data?.login;
      const channelID = state.channel.data?.id;
      const URL = `http://localhost:8081/channel/${channelName}/create`;
      const emotes = createEmotesArrayForSave();
      const body = {
        channelID,
        profileImageURL: profileImageURL.value,
        emotes: emotes,
      };

      try {
        console.log(
          `Attempting to save ${emotes.length} emotes for channel ${channelName} (ID: ${channelID}) ...`
        );
        const { status, statusText } = await axios.post(URL, body, {
          validateStatus: () => true,
          ...headers,
        });
        console.log(`${status}: ${statusText}`);
        isSaving.value = false;
        isSaved.value = true;
      } catch (error) {
        isSaving.value = false;
        saveFailed.value = true;
        console.error(error);
      }
    }

    return {
      channelNameInput,
      updateChannelNameInput,
      channelName,
      profileImageURL,
      providerList,
      hasChannelData,
      isLoading,
      isDone,
      isFailed,
      isSaving,
      isSaved,
      saveFailed,
      providerLoading,
      providerSuccess,
      providerError,
      providerEmoteCount,
      totalEmoteCount,
      hasDuplicateEmoteCodes,
      duplicateEmotesByCode,
      submitFindChannelForm,
      resetState,
      save,
    };
  },
});
</script>
