<template>
  <AdminTopBar />
  <TheSubheader msg="Add Channel" />
  <div>
    <form
      v-if="!isDone"
      class="m-2 flex justify-center items-stretch"
      @submit.prevent="submitFindChannelForm"
    >
      <input
        id="channelName"
        v-model="channelNameInput"
        type="text"
        class="
          p-2
          min-w-60
          border-1 border-r-0 border-blue-200
          rounded-l-md
          outline-none
          active:outline-none
        "
        aria-label="channel name"
        placeholder="Enter channel name..."
        spellcheck="false"
      />
      <button
        class="
          px-4
          py-2
          bg-blue-500
          font-bold
          text-warm-gray-200
          rounded-r-md
          disabled:bg-blue-200 disabled:cursor-not-allowed
          focus-within:outline-none
          focus:outline-none
        "
        :disabled="isLoading || !channelNameInput.trim().length"
        @click="submitFindChannelForm"
      >
        Search
      </button>
    </form>
    <div v-else class="flex justify-center text-center">
      <button
        class="
          m-2
          bg-gray-500
          text-light-500
          tracking-wider
          px-4
          py-1
          border-2
          font-bold
          text-lg
          rounded-md
        "
        :class="`${!isFailed ? 'bg-green-600 border-green-900' : ''}`"
        :disabled="isFailed || isSaving || isSaved || saveFailed"
        @click="save"
      >
        Save
      </button>
      <button
        class="
          m-2
          bg-rose-600
          border-rose-900
          text-light-500
          tracking-wider
          px-4
          py-1
          border-2
          font-bold
          text-lg
          rounded-md
        "
        :disabled="isSaving"
        @click="resetState"
      >
        Reset
      </button>
    </div>
    <div v-if="hasChannelData" class="m-4 flex justify-center items-center">
      <div class="flex flex-col justify-start items-center">
        <img
          class="max-w-48 border-light-700 border-4 rounded-md"
          :src="profileImageURL ?? ''"
          :alt="`profile image for ${channelName}`"
        />
        <div class="p-2 text-center tracking-wide text-2xl font-bold">
          {{ channelName }}
        </div>
      </div>
      <div class="mx-4 flex flex-col justify-evenly self-stretch">
        <div class="text-3xl font-bold text-center underline small-caps">
          Emote Providers
        </div>
        <div class="flex justify-evenly">
          <div
            v-for="providerName in providerList"
            :key="providerName"
            class="flex flex-col items-stretch"
          >
            <div class="text-2xl font-bold underline small-caps">
              {{ providerName }}
            </div>
            <div class="font-bold text-2xl text-center">
              <font-awesome-icon
                v-if="providerLoading(providerName)"
                icon="spinner"
                class="animate-spin"
              />
              <span
                v-else
                class="text-shadow-sm font-bold tracking-wider"
                :class="
                  providerSuccess(providerName)
                    ? 'text-emerald-600'
                    : 'text-rose-700'
                "
              >
                {{
                  providerSuccess(providerName) || !providerError(providerName)
                    ? providerEmoteCount(providerName)
                    : "X"
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex my-1 mx-2 justify-center items-center tracking-wide">
          <div class="text-2xl font-bold">
            <span>Total: </span>
            <span
              class="text-shadow-sm"
              :class="totalEmoteCount ? 'text-emerald-600' : 'text-rose-700'"
              >{{ totalEmoteCount }}</span
            >
          </div>
          <div class="text-gray-400 font-light text-2xl px-2">
            (<span class="font-normal">{{
              totalEmoteCount - duplicateEmotesByCode.size
            }}</span>
            unique codes)
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasDuplicateEmoteCodes" class="flex justify-center items-center">
      <span
        class="
          py-1
          px-2
          mx-4
          font-inconsolata font-extrabold
          tracking-wide
          text-red-700
          bg-red-50
          border-2 border-red-700
          rounded-md
        "
        >Warning</span
      >
      <div class="flex flex-col">
        <div class="p-1 font-bold">
          {{ duplicateEmotesByCode.size }} emote codes have duplicate entries
          from providers.
        </div>
        <div class="p-1 font-bold">
          Since usage is tracked by emote code,
          <u>only one provider's instance will be stored</u>.
        </div>
        <div class="p-1 font-bold">
          Provider precedence is:
          <span class="pl-1 font-inconsolata font-bold tracking-wider">{{
            providerList.join(" -> ")
          }}</span>
        </div>
      </div>
    </div>
    <ul class="my-4 flex justify-evenly flex-wrap items-stretch">
      <li
        v-for="[duplicateCode, emotes] in duplicateEmotesByCode"
        :key="duplicateCode"
        class="m-2 flex justify-evenly border-2 border-light-600 rounded-md p-2"
      >
        <div class="p-2 flex flex-col items-center">
          <img
            class="w-8 flex"
            :src="emotes[0].image"
            :alt="`${duplicateCode} from ${emotes[0].provider}`"
          />
          <div class="font-inconsolata font-semibold tracking-wider">
            {{ duplicateCode }}
          </div>
        </div>
        <ul class="flex flex-col justify-evenly">
          <li
            v-for="(emote, index) in emotes"
            :key="`${emote.code}-${emote.provider}`"
            class="p-1 font-bold tracking-wide text-center"
            :class="index === 0 ? 'border-2 border-green-500 rounded-md' : ''"
          >
            {{ emote.provider }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
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
import AdminTopBar from "../components/AdminTopBar.vue";
import TheSubheader from "../components/TheSubheader.vue";

export default defineComponent({
  name: "AddChannelPage",
  components: {
    AdminTopBar,
    TheSubheader,
  },
  setup() {
    const channelNameInput = ref("");

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
      state.channel.data ? state.channel.data.profile_image_url : null
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
