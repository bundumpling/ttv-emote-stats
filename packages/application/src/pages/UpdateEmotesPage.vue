<template>
  <AdminTopBar />
  <TheSubheader :msg="`Update ${channelName}'s Channel Emotes`" />
  <Loading v-if="isLoading" />
  <div v-else-if="isLoaded">
    <EmotesFromProvidersSummary
      :twitch-user="TwitchUser"
      :emotes-from-providers="EmotesFromProviders"
    />
    <UpdatedEmotesSummary
      :twitch-user="TwitchUser"
      :emotes-from-providers="EmotesFromProviders"
      :emotes-from-database="EmotesFromDatabase"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import TheSubheader from "../components/TheSubheader.vue";
import Loading from "../components/TheLoadingSpinner.vue";
import AdminTopBar from "@/components/AdminTopBar.vue";
import EmotesFromProvidersSummary from "@/components/EmotesFromProvidersSummary.vue";
import UpdatedEmotesSummary from "@/components/UpdatedEmotesSummary.vue";
import { useTwitchUser } from "@/composables/useTwitchUser";
import { useEmotesFromDatabase } from "@/composables/useEmotesFromDatabase";
import { useEmotesFromProviders } from "@/composables/useEmotesFromProviders";

export default defineComponent({
  name: "UpdateEmotesPage",
  components: {
    AdminTopBar,
    TheSubheader,
    Loading,
    EmotesFromProvidersSummary,
    UpdatedEmotesSummary,
  },
  setup() {
    const route = useRoute();

    const channelName = Array.isArray(route.params.channelName)
      ? route.params.channelName.join()
      : route.params.channelName;

    const isLoading = ref(false);
    const isLoaded = ref(false);
    const isFailed = ref(false);
    const isSaving = ref(false);
    const isSaved = ref(false);
    const saveFailed = ref(false);

    const TwitchUser = useTwitchUser();
    const EmotesFromDatabase = useEmotesFromDatabase();
    const EmotesFromProviders = useEmotesFromProviders();

    async function fetchData() {
      isLoading.value = true;
      try {
        await TwitchUser.requestTwitchUser(channelName);
        if (TwitchUser.hasChannelData.value) {
          const channelID = TwitchUser.channelID.value;
          if (channelName && channelID) {
            await EmotesFromDatabase.requestDatabaseEmotes(channelName);
            await EmotesFromProviders.requestProviderEmotes(
              channelName,
              channelID
            );
          } else {
            isFailed.value = true;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
        isLoaded.value = true;
      }
    }

    onBeforeMount(fetchData);

    return {
      channelName,
      isLoading,
      isLoaded,
      isFailed,
      isSaving,
      isSaved,
      saveFailed,
      TwitchUser,
      EmotesFromProviders,
      EmotesFromDatabase,
    };
  },
});
</script>
