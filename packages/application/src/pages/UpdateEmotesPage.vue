<template>
  <TheSubheader :msg="`Update ${channelName}'s Channel Emotes`" />
  <div v-if="!loading">
    <div class="control-wrapper">
      <button :disabled="!hasUpdates" @click="saveUpdatedEmotes">
        Save Updated Emotes
      </button>
      <span @click="toggleDetailedView">
        {{
          `[ Switch to ${showDetailedView ? "condensed" : "detailed"} view ]`
        }}
      </span>
    </div>
    <DetailedView v-if="showDetailedView" :updated-emotes="updatedEmotes" />
    <CondensedView v-if="!showDetailedView" :updated-emotes="updatedEmotes" />
  </div>
  <Loading v-else-if="!error" />
  <div v-else class="error">Error</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, computed, ref } from "vue";
import { useRoute } from "vue-router";
import {
  UpdateEmotesState,
  Emote,
  EmoteForUpdate,
  EmoteFromProvider,
} from "@/types";
import TheSubheader from "../components/TheSubheader.vue";
import DetailedView from "../components/ManageUpdateEmotesDetailedView.vue";
import CondensedView from "../components/ManageUpdateEmotesCondensedView.vue";
import Loading from "../components/TheLoadingSpinner.vue";
import axios from "axios";

export default defineComponent({
  name: "UpdateEmotesPage",
  components: {
    TheSubheader,
    DetailedView,
    CondensedView,
    Loading,
  },
  setup() {
    const route = useRoute();

    const channelName = Array.isArray(route.params.channelName)
      ? route.params.channelName.join()
      : route.params.channelName;

    const loading = ref(true);
    const error = ref(false);

    const state = reactive<UpdateEmotesState>({
      channelID: null,
      emotesFromDatabase: [],
      emotesFromProviders: [],
      emoteCodes: [],
    });

    interface ChannelEmoteDataResponse {
      channelName: string;
      channelID: string;
      emotesFromDatabase: Emote[];
      emotesFromProviders: EmoteFromProvider[];
      emoteCodes: string[];
    }

    async function fetchData(): Promise<ChannelEmoteDataResponse> {
      try {
        const URL = `http://localhost:8081/channel/${channelName}/emotesFromDbAndProviders`;
        const token = localStorage.getItem("user");
        const response = await axios.get(URL, {
          headers: { authorization: token },
        });
        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    }

    onBeforeMount(async () => {
      try {
        const {
          channelID,
          emotesFromDatabase,
          emotesFromProviders,
          emoteCodes,
        } = await fetchData();
        state.channelID = channelID;
        state.emotesFromDatabase = emotesFromDatabase;
        state.emotesFromProviders = emotesFromProviders;
        state.emoteCodes = emoteCodes;
      } catch (err) {
        error.value = true;
      }
      loading.value = false;
    });

    const hasUpdates = ref(false);
    const showDetailedView = ref(false);

    const updatedEmotes = computed((): Array<EmoteForUpdate> => {
      type tResult = {
        [key: string]: EmoteForUpdate;
      };
      let result: tResult = {};

      state.emotesFromDatabase.forEach((emote: Emote) => {
        const { code, image, provider, providerID, obsolete } = emote;
        result[code] = {
          code,
          image,
          provider,
          providerID,
          obsolete,
          isUnavailable: true,
          isNew: false,
          isUpdated: false,
        }; // flag obsolete until matching provider emote found
      });

      state.emotesFromProviders.forEach((emote: EmoteFromProvider) => {
        const { code, image, provider, providerID } = emote;

        if (!result[code]) {
          // NEW EMOTE
          result[code] = {
            code,
            image,
            provider,
            providerID,
            obsolete: false,
            isNew: true,
            isUnavailable: false,
            isUpdated: false,
          };
        } else {
          // Compare...
          if (
            result[code].image !== image ||
            result[code].provider !== provider ||
            result[code].providerID !== providerID
          ) {
            result[code] = {
              code,
              image,
              provider,
              providerID,
              obsolete: false,
              isUpdated: true,
              isNew: false,
              isUnavailable: false,
            };
          } else {
            result[code] = {
              ...result[code],
              obsolete: false,
              isUpdated: false,
              isUnavailable: false,
              isNew: false,
            };
          }
        }
      });

      const quantifyCompare = (emote: EmoteForUpdate) => {
        const { isNew, isUnavailable, isUpdated } = emote;
        let value = 0;
        if (isNew) value += 5;
        if (isUnavailable) value += 3;
        if (isUpdated) value += 1;

        if (value) hasUpdates.value = true;

        return value;
      };

      return Object.keys(result)
        .map((code) => ({ ...result[code] }))
        .sort((a: EmoteForUpdate, b: EmoteForUpdate) => {
          return quantifyCompare(b) - quantifyCompare(a);
        });
    });

    function toggleDetailedView() {
      showDetailedView.value = !showDetailedView.value;
    }

    async function saveUpdatedEmotes() {
      const emotes = updatedEmotes.value
        .filter((emote: EmoteForUpdate) => {
          return emote.isNew || emote.isUnavailable || emote.isUpdated;
        })
        .map((emote: EmoteForUpdate) => {
          if (emote.isUnavailable) {
            return { ...emote, obsolete: true };
          } else {
            return emote;
          }
        });

      try {
        const URL = `http://localhost:8081/channel/${channelName}/saveUpdatedEmotes`;
        const token = localStorage.getItem("user");
        await axios.post(URL, {
          headers: { authorization: token },
          channelID: state.channelID,
          emotes,
        });
      } catch (err) {
        console.log(err);
      }
    }

    return {
      channelName,
      updatedEmotes,
      hasUpdates,
      saveUpdatedEmotes,
      showDetailedView,
      toggleDetailedView,
      loading,
      error,
    };
  },
});
</script>

<style lang="scss">
.control-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 1.2em;
  color: blue;
  font-family: monospace;

  span {
    cursor: pointer;
  }
}
</style>
