<template>
  <TheSubheader :msg="`Update ${channelName}'s Channel Emotes`" />
  <div class="container table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>IMG</th>
          <th>Code</th>
          <th>Provider</th>
          <th>New</th>
          <th>Obsolete</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emote in tableData" :key="emote.code">
          <td><img :src="emote.image" /></td>
          <td class="emote-code">{{ emote.code }}</td>
          <td class="emote-provider">{{ emote.provider }}</td>
          <td>
            <font-awesome-icon
              v-if="Boolean(emote.isNew)"
              icon="check"
              class="checkmark"
            />
          </td>
          <td>
            <font-awesome-icon
              v-if="Boolean(emote.obsolete)"
              icon="check"
              class="checkmark"
            />
          </td>
          <td>
            <font-awesome-icon
              v-if="Boolean(emote.isUpdated)"
              icon="check"
              class="checkmark"
            />
          </td>
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
import { IEmote, IEmoteForUpdate } from "@/types";
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

.emote-provider {
  font-weight: bold;
}

.checkmark {
  font-size: 1.2em;
  color: green;
}
</style>