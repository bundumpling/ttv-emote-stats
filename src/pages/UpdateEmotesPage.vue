<template>
  <TheSubheader :msg="`Update ${channelName}'s Channel Emotes`" />
  <div class="control-wrapper">
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
import { IEmote, IEmoteForUpdate } from "@/types";
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
    // OptionsPanel,
    // APIControlContainer,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const channelName = route.params.channelName;

    onMounted(() => {
      // reduce unnecessary backend api calls
      if (!store.state.settings.channelEmoteData.emotesFromProviders.length) {
        store.dispatch("getChannelEmotesFromDatabaseAndProviders", channelName);
      }
    });

    const showDetailedView = ref(false);

    const updatedEmotes = computed((): Array<IEmoteForUpdate> => {
      const { emotesFromDatabase, emotesFromProviders } =
        store.state.settings.channelEmoteData;

      type tResult = {
        [key: string]: IEmoteForUpdate;
      };
      let result: tResult = {};

      emotesFromDatabase.forEach((emote: IEmote) => {
        const { code, image, provider, providerID } = emote;
        result[code] = {
          code,
          image,
          provider,
          providerID,
          obsolete: true,
          isNew: false,
          isUpdated: false,
        }; // flag obsolete until matching provider emote found
      });

      emotesFromProviders.forEach((emote: IEmote) => {
        const { code, image, provider, providerID } = emote;

        if (!result[code]) {
          // NEW EMOTE
          result[code] = {
            code,
            image,
            provider,
            providerID,
            isNew: true,
            obsolete: false,
            isUpdated: false,
          };
        } else {
          let isUpdated = false;
          // Compare...
          if (
            result[code].image !== image ||
            result[code].provider !== provider ||
            result[code].providerID !== providerID
          ) {
            isUpdated = true;
            result[code] = {
              code,
              image,
              provider,
              providerID,
              isUpdated,
              isNew: false,
              obsolete: false,
            };
          } else {
            result[code] = {
              ...result[code],
              isUpdated,
              isNew: false,
              obsolete: false,
            };
          }
        }
      });

      const quantifyCompare = (emote: IEmoteForUpdate) => {
        const { isNew, obsolete, isUpdated } = emote;
        let value = 0;
        if (isNew) value += 5;
        if (obsolete) value += 3;
        if (isUpdated) value += 1;
        return value;
      };

      return Object.keys(result)
        .map((code) => ({ ...result[code] }))
        .sort((a: IEmoteForUpdate, b: IEmoteForUpdate) => {
          return quantifyCompare(b) - quantifyCompare(a);
        });
    });

    function toggleDetailedView() {
      showDetailedView.value = !showDetailedView.value;
    }

    return {
      channelName,
      updatedEmotes,
      showDetailedView,
      toggleDetailedView,
    };
  },
});
</script>

<style>
.control-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 1.2em;
  color: blue;
  cursor: pointer;
  font-family: monospace;
}
</style>