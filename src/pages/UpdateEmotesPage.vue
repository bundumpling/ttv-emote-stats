<template>
  <TheSubheader :msg="`Update ${channelName}'s Channel Emotes`" />
  <div class="container table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th><abbr title="Image">IMG</abbr></th>
          <th>Code</th>
          <th><abbr title="Provider">Provider</abbr></th>
          <th>New</th>
          <th><abbr title="Updated">Updated</abbr></th>
          <th><abbr title="Obsolete">Obsolete</abbr></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emote in tableData" :key="emote.code">
          <td><img :src="emote.image" /></td>
          <td class="emote-code">{{ emote.code }}</td>
          <td>{{ emote.provider }}</td>
          <td>{{ Boolean(emote.isNew) }}</td>
          <td>{{ Boolean(emote.isUpdated) }}</td>
          <td>{{ Boolean(emote.obsolete) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "../store";
import TheSubheader from "../components/TheSubheader.vue";
import { IEmote } from "@/types";
// import OptionsPanel from "../components/SettingsControlPanel.vue";
// import APIControlContainer from "../components/SettingsAPIControlContainer.vue";

export default defineComponent({
  name: "UpdateEmotesPage",
  components: {
    TheSubheader,
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

    const tableData = computed(() => {
      const { emotesFromDatabase, emotesFromProviders } =
        store.state.settings.channelEmoteData;

      type tResult = {
        [key: string]: {
          image: string;
          provider: string;
          providerID: string;
          obsolete?: boolean;
          isNew?: boolean;
          isUpdated?: boolean;
        };
      };
      let result: tResult = {};

      emotesFromDatabase.forEach((emote: IEmote) => {
        const { code, image, provider, providerID } = emote;
        result[code] = { image, provider, providerID, obsolete: true }; // flag obsolete until matching provider emote found
      });

      emotesFromProviders.forEach((emote: IEmote) => {
        const { code, image, provider, providerID } = emote;

        if (!result[code]) {
          // NEW EMOTE
          result[code] = {
            image,
            provider,
            providerID,
            isNew: true,
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
              image,
              provider,
              providerID,
              isUpdated,
              obsolete: false,
            };
          } else {
            result[code] = {
              ...result[code],
              isUpdated,
              obsolete: false,
            };
          }
        }
      });

      return Object.keys(result).map((code) => ({
        code,
        ...result[code],
      }));
    });

    const hasNew = computed(() => tableData.value.find((emote) => emote.isNew));
    const hasUpdated = computed(() =>
      tableData.value.find((emote) => emote.isUpdated)
    );
    const hasObsolete = computed(() =>
      tableData.value.find((emote) => emote.obsolete)
    );

    return {
      channelName,
      tableData,
      hasNew,
      hasUpdated,
      hasObsolete,
    };
  },
});
</script>

<style>
.table {
  margin: 0 auto;
}

tr {
  text-align: center;
}

.emote-code {
  font-family: monospace;
}
</style>