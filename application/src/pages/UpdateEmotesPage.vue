<template>
  <TheSubheader :msg="`Update ${channelName}'s Channel Emotes`" />
  <div class="control-wrapper">
    <button @click="saveUpdatedEmotes" :disabled="!hasUpdates">
      Save Updated Emotes
    </button>
    <span @click="toggleDetailedView">
      {{ `[ Switch to ${showDetailedView ? "condensed" : "detailed"} view ]` }}
    </span>
  </div>
  <DetailedView v-if="showDetailedView" :updatedEmotes="updatedEmotes" />
  <CondensedView v-if="!showDetailedView" :updatedEmotes="updatedEmotes" />
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "../store";
import { Emote, EmoteForUpdate } from "../types";
import TheSubheader from "../components/TheSubheader.vue";
import DetailedView from "../components/ManageUpdateEmotesDetailedView.vue";
import CondensedView from "../components/ManageUpdateEmotesCondensedView.vue";
// import OptionsPanel from "../components/SettingsControlPanel.vue";
// import APIControlContainer from "../components/SettingsAPIControlContainer.vue";

export default defineComponent({
  name: "UpdateEmotesPage",
  components: {
    TheSubheader,
    DetailedView,
    CondensedView,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const channelName = route.params.channelName;

    onMounted(() => {
      // reduce unnecessary backend api calls
      if (
        !store.state.settings.channelEmoteData.emotesFromProviders.length ||
        store.state.settings.channelEmoteData.channelName !== channelName
      ) {
        store.dispatch("getChannelEmotesFromDatabaseAndProviders", channelName);
      }
    });

    const hasUpdates = ref(false);
    const showDetailedView = ref(false);

    const updatedEmotes = computed((): Array<EmoteForUpdate> => {
      const { emotesFromDatabase, emotesFromProviders } =
        store.state.settings.channelEmoteData;

      type tResult = {
        [key: string]: EmoteForUpdate;
      };
      let result: tResult = {};

      emotesFromDatabase.forEach((emote: Emote) => {
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

      emotesFromProviders.forEach((emote: Emote) => {
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

    function saveUpdatedEmotes() {
      const emotes = updatedEmotes.value.filter((emote: EmoteForUpdate) => {
        return emote.isNew || emote.isUnavailable || emote.isUpdated;
      }).map((emote: EmoteForUpdate) => {
        if (emote.isUnavailable) {
          return { ...emote, obsolete: true }
        } else {
          return emote;
        }
      });
      store.dispatch("saveUpdatedEmotesToDB", {
        channelName,
        channelID: store.state.settings.channelEmoteData.channelID,
        emotes,
      });
    }

    return {
      channelName,
      updatedEmotes,
      hasUpdates,
      saveUpdatedEmotes,
      showDetailedView,
      toggleDetailedView,
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