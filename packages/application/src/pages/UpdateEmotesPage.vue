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

    // const updatedEmotes = computed((): Array<EmoteForUpdate> => {
    //   type tResult = {
    //     [key: string]: EmoteForUpdate;
    //   };
    //   let result: tResult = {};

    //   databaseEmoteState.data.forEach((emote: Emote) => {
    //     const { code, image, provider, providerID, obsolete } = emote;
    //     result[code] = {
    //       code,
    //       image,
    //       provider,
    //       providerID,
    //       obsolete,
    //       isUnavailable: true,
    //       isNew: false,
    //       isUpdated: false,
    //     }; // flag obsolete until matching provider emote found
    //   });

    //   providerEmoteState.data.forEach((emote: EmoteFromProvider) => {
    //     const { code, image, provider, providerID } = emote;

    //     if (!result[code]) {
    //       // NEW EMOTE
    //       result[code] = {
    //         code,
    //         image,
    //         provider,
    //         providerID,
    //         obsolete: false,
    //         isNew: true,
    //         isUnavailable: false,
    //         isUpdated: false,
    //       };
    //     } else {
    //       // Compare...
    //       if (
    //         result[code].image !== image ||
    //         result[code].provider !== provider ||
    //         result[code].providerID !== providerID
    //       ) {
    //         result[code] = {
    //           code,
    //           image,
    //           provider,
    //           providerID,
    //           obsolete: false,
    //           isUpdated: true,
    //           isNew: false,
    //           isUnavailable: false,
    //         };
    //       } else {
    //         result[code] = {
    //           ...result[code],
    //           obsolete: false,
    //           isUpdated: false,
    //           isUnavailable: false,
    //           isNew: false,
    //         };
    //       }
    //     }
    //   });

    //   const quantifyCompare = (emote: EmoteForUpdate) => {
    //     const { isNew, isUnavailable, isUpdated } = emote;
    //     let value = 0;
    //     if (isNew) value += 5;
    //     if (isUnavailable) value += 3;
    //     if (isUpdated) value += 1;

    //     if (value) hasUpdates.value = true;

    //     return value;
    //   };

    //   return Object.keys(result)
    //     .map((code) => ({ ...result[code] }))
    //     .sort((a: EmoteForUpdate, b: EmoteForUpdate) => {
    //       return quantifyCompare(b) - quantifyCompare(a);
    //     });
    // });
    // async function saveUpdatedEmotes() {
    //   const emotes = updatedEmotes.value
    //     .filter((emote: EmoteForUpdate) => {
    //       return emote.isNew || emote.isUnavailable || emote.isUpdated;
    //     })
    //     .map((emote: EmoteForUpdate) => {
    //       if (emote.isUnavailable) {
    //         return { ...emote, obsolete: true };
    //       } else {
    //         return emote;
    //       }
    //     });

    //   try {
    //     const URL = `http://localhost:8081/channel/${channelName}/saveUpdatedEmotes`;
    //     const token = localStorage.getItem("user");
    //     const requestBody = {
    //       channelID: state.channelID,
    //       emotes,
    //     };
    //     const requestHeaders = {
    //       headers: {
    //         authorization: token,
    //       },
    //     };
    //     await axios.post(URL, requestBody, requestHeaders);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

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
