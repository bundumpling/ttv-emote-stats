<template>
  <TheSubheader :msg="`Channel Emote Rankings for ${channelName}`" />
  <div v-if="!loading">
    <Controls />
    <EmoteListContainer />
  </div>
  <Loading v-else-if="!error" />
  <div v-else class="error">Error</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeMount, provide } from "vue";
import { useRoute } from "vue-router";
import TheSubheader from "../components/TheSubheader.vue";
import Loading from "../components/TheLoadingSpinner.vue";
import Controls from "../components/ChannelControls.vue";
import EmoteListContainer from "../components/ChannelEmoteListContainer.vue";
import { ChannelState, Emote, EmoteFromList, ISearchInput } from "@/types";
import axios, { AxiosResponse } from "axios";

export default defineComponent({
  name: "ChannelPage",
  components: {
    TheSubheader,
    Loading,
    Controls,
    EmoteListContainer,
  },
  setup() {
    const route = useRoute();

    const channelName = Array.isArray(route.params.channelName)
      ? route.params.channelName.join()
      : route.params.channelName;

    const loading = ref(true);
    const error = ref(false);

    const state = reactive<ChannelState>({
      name: channelName,
      twitchID: null,
      emotes: [],
      hasEmotesFrom: {
        Twitch: false,
        FFZ: false,
        BTTV: false,
        "7TV": false,
      },
      emoteDetails: {
        code: "",
        rank: 0,
        stateIndex: 0,
        image: "",
        provider: "",
        providerID: "",
        obsolete: false,
        usedBy: {},
        usedOn: {},
        fromList: "",
      },
      loadingEmoteDetails: false,
      emoteDetailsModalOpen: false,
      emotesPerPage: 10,
      emoteSearchInput: "",
      userSearchInput: "",
      setEmoteSearchInput: function (input: string) {
        this.emoteSearchInput = input;
      },
      setUserSearchInput: function (input: string) {
        this.userSearchInput = input;
      },
      userSearchLocked: false,
      toggleUserSearchLock: function () {
        this.userSearchLocked = !this.userSearchLocked;
      },
      openEmoteDetailsModal: function (emote: EmoteFromList, fromList: string) {
        this.emoteDetails = { ...emote, fromList };
        this.emoteDetailsModalOpen = true;
        this.loadingEmoteDetails = false;
      },
      closeEmoteDetailsModal: function () {
        this.emoteDetailsModalOpen = false;
        if (!this.userSearchLocked) {
          this.userSearchInput = "";
        }
      },
      setEmotesPerPage: function (value: number) {
        this.emotesPerPage = value;
      },
    });

    interface ChannelEmoteCountsResponse {
      _id: string;
      emotes: Array<Emote>;
    }

    async function fetchData(): Promise<ChannelEmoteCountsResponse> {
      const URL = `http://localhost:8081/channel/${channelName}/emoteCounts`;
      const response = await axios.get(URL);
      return response.data;
    }

    onBeforeMount(async () => {
      try {
        const { _id, emotes } = await fetchData();
        const twitchID = _id;

        Object.keys(state.hasEmotesFrom).forEach((provider) => {
          if (
            emotes.some(
              (emote: { provider: string }) => emote.provider === provider
            )
          ) {
            state.hasEmotesFrom[provider] = true;
          }
        });

        state.twitchID = twitchID;
        state.emotes = emotes;
        loading.value = false;
      } catch (err) {
        console.log(err);
        error.value = true;
      }
    });

    const getEmoteDetails = async (emote: EmoteFromList, fromList: string) => {
      state.loadingEmoteDetails = true;
      if (
        state.emotes[emote.stateIndex].usedBy !== undefined &&
        state.emotes[emote.stateIndex].usedOn !== undefined
      ) {
        console.log(
          `Usage details for ${emote.code} already known... skipping API call.`
        );
        state.openEmoteDetailsModal(emote, fromList);
      } else {
        const URL = `http://localhost:8081/emote/${emote._id}/usageDetails`;
        const response = (await axios.get(URL)) as AxiosResponse;
        const { usedBy, usedOn } = response.data;
        state.emotes[emote.stateIndex].usedBy = usedBy;
        state.emotes[emote.stateIndex].usedOn = usedOn;
        state.openEmoteDetailsModal({ ...emote, usedBy, usedOn }, fromList);
      }
    };

    provide("state", state);
    provide("getEmoteDetails", getEmoteDetails);
    provide("emoteSearch", {
      name: "emoteSearch",
      getInput: () => state.emoteSearchInput,
      setInput: (value) => state.setEmoteSearchInput(value),
      validationRegExp: new RegExp(/[^a-z0-9]/, "gi"),
      reset: () => state.setEmoteSearchInput(""),
    } as ISearchInput);

    provide("userSearch", {
      name: "userSearch",
      getInput: (): string => state.userSearchInput,
      setInput: (value: string): void => state.setUserSearchInput(value),
      validationRegExp: new RegExp(/[^a-z0-9_]/, "gi"),
      reset: (): void => state.setUserSearchInput(""),
      lockable: true,
      isLocked: (): boolean => state.userSearchLocked,
      toggleLock: (): void => state.toggleUserSearchLock(),
    } as unknown as ISearchInput);

    return {
      channelName,
      loading,
      error,
    };
  },
});
</script>

<style></style>
