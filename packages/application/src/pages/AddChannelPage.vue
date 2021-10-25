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
    v-if="TwitchUser.hasChannelData.value"
    :twitch-user="TwitchUser"
    :emotes-from-providers="EmotesFromProviders"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AdminTopBar from "@/components/AdminTopBar.vue";
import TheSubheader from "@/components/TheSubheader.vue";
import FindChannelForm from "@/components/FindChannelForm.vue";
import SaveResetControls from "@/components/SaveResetControls.vue";
import EmotesFromProvidersSummary from "@/components/EmotesFromProvidersSummary.vue";
import { useTwitchUser } from "@/composables/useTwitchUser";
import { useEmotesFromProviders } from "@/composables/useEmotesFromProviders";
import { Emote } from "@ttv-emote-stats/common";
import axios from "axios";

export default defineComponent({
  name: "AddChannelPage",
  components: {
    AdminTopBar,
    TheSubheader,
    FindChannelForm,
    SaveResetControls,
    EmotesFromProvidersSummary,
  },
  setup() {
    const TwitchUser = useTwitchUser();
    const EmotesFromProviders = useEmotesFromProviders();

    const channelNameInput = ref("");

    function updateChannelNameInput(value: string): void {
      channelNameInput.value = value;
    }

    const isLoading = ref(false);
    const isDone = ref(false);
    const isFailed = ref(false);
    const isSaving = ref(false);
    const isSaved = ref(false);
    const saveFailed = ref(false);

    async function resetState() {
      TwitchUser.resetState();
      EmotesFromProviders.resetState();
      isLoading.value = false;
      isDone.value = false;
      isFailed.value = false;
      isSaving.value = false;
      isSaved.value = false;
      saveFailed.value = false;
      channelNameInput.value = "";
    }

    async function submitFindChannelForm() {
      isLoading.value = true;
      try {
        await TwitchUser.requestTwitchUser(channelNameInput.value);
        if (TwitchUser.hasChannelData) {
          const channelName = TwitchUser.channelName.value;
          const channelID = TwitchUser.channelID.value;
          if (channelName && channelID) {
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
        isDone.value = true;
      }
    }

    function createEmotesArrayForSave(): Emote[] {
      return Array.from(EmotesFromProviders.emotesByCode.value.values()).map(
        (emotes: Emote[]) => emotes[0]
      );
    }

    async function save() {
      isSaving.value = true;
      console.log("Saving channel to DB...");
      const channelName = TwitchUser.channelName.value;
      const channelID = TwitchUser.channelID.value;
      const emotes = createEmotesArrayForSave();
      const URL = `http://localhost:8081/channel/${channelName}/create`;
      const body = {
        channelID,
        profileImageURL: TwitchUser.profileImageURL.value,
        emotes: emotes,
      };
      const token = localStorage.getItem("user");
      const headers = {
        validateStatus: () => true,
        headers: { authorization: token },
      };

      try {
        console.log(
          `Attempting to save ${emotes.length} emotes for channel ${channelName} (ID: ${channelID}) ...`
        );
        const { status, statusText } = await axios.post(URL, body, headers);
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
      TwitchUser,
      EmotesFromProviders,
      isLoading,
      isDone,
      isFailed,
      isSaving,
      isSaved,
      saveFailed,
      submitFindChannelForm,
      resetState,
      save,
    };
  },
});
</script>
