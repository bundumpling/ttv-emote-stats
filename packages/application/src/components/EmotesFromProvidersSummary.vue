<template>
  <div class="m-4 flex justify-center items-center">
    <div class="flex flex-col justify-start items-center">
      <img
        v-if="twitchUser.profileImageURL.value"
        class="
          max-w-48
          border-light-700 border-4
          rounded-md
          bg-light-100
          shadow-md shadow-dark-200
        "
        :src="twitchUser.profileImageURL.value"
        :alt="`profile image for ${twitchUser.channelName.value}`"
      />
      <div
        class="p-2 text-center tracking-wide text-2xl font-bold text-shadow-sm"
      >
        {{ twitchUser.channelName.value }}
      </div>
    </div>
    <div class="mx-4 flex flex-col justify-evenly self-stretch">
      <div
        class="
          text-3xl
          font-bold
          text-center
          underline
          small-caps
          text-shadow-sm
        "
      >
        Emote Providers
      </div>
      <div class="flex justify-evenly">
        <div
          v-for="providerName in providerList"
          :key="providerName"
          class="flex flex-col items-stretch"
        >
          <div
            class="
              text-2xl
              font-bold
              underline
              small-caps
              tracking-wide
              text-shadow-sm
            "
          >
            {{ providerName }}
          </div>
          <div class="font-bold text-2xl text-center">
            <font-awesome-icon
              v-if="emotesFromProviders.providerLoading(providerName)"
              icon="spinner"
              class="animate-spin"
            />
            <span
              v-else
              class="text-shadow-sm font-bold tracking-wider"
              :class="
                emotesFromProviders.providerSuccess(providerName)
                  ? 'text-emerald-600'
                  : 'text-rose-700'
              "
            >
              {{
                emotesFromProviders.providerSuccess(providerName) ||
                !emotesFromProviders.providerError(providerName)
                  ? emotesFromProviders.providerEmoteCount(providerName)
                  : "X"
              }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex my-1 mx-2 justify-center items-center tracking-wide">
        <div class="text-2xl font-bold">
          <span class="tracking-wide text-shadow-sm">Total: </span>
          <span
            class="text-shadow-sm"
            :class="
              emotesFromProviders.totalEmoteCount.value
                ? 'text-emerald-600'
                : 'text-rose-700'
            "
            >{{ emotesFromProviders.totalEmoteCount.value }}</span
          >
        </div>
        <div class="text-gray-400 font-light text-2xl px-2">
          (<span class="font-normal">{{
            emotesFromProviders.emotesByCode.value.size
          }}</span>
          unique codes)
        </div>
      </div>
    </div>
  </div>
  <DuplicateEmoteCodesSummary
    v-if="emotesFromProviders.hasDuplicateEmoteCodes.value"
    :duplicate-emotes-by-code="emotesFromProviders.duplicateEmotesByCode.value"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  providerList,
  UseEmotesFromProviders,
} from "@/composables/useEmotesFromProviders";
import { UseTwitchUser } from "@/composables/useTwitchUser";
import DuplicateEmoteCodesSummary from "./DuplicateEmoteCodesSummary.vue";

export default defineComponent({
  name: "EmotesFromProvidersSummary",
  components: { DuplicateEmoteCodesSummary },
  props: {
    twitchUser: {
      type: Object as PropType<UseTwitchUser>,
      required: true,
    },
    emotesFromProviders: {
      type: Object as PropType<UseEmotesFromProviders>,
      required: true,
    },
  },
  setup() {
    return {
      providerList,
    };
  },
});
</script>
