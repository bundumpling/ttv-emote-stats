<template>
  <div class="m-4 flex justify-center items-center">
    <div class="flex flex-col justify-start items-center">
      <img
        v-if="profileImageURL"
        class="
          max-w-48
          border-light-700 border-4
          rounded-md
          bg-light-100
          shadow-md shadow-dark-200
        "
        :src="profileImageURL"
        :alt="`profile image for ${channelName}`"
      />
      <div
        class="p-2 text-center tracking-wide text-2xl font-bold text-shadow-sm"
      >
        {{ channelName }}
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
              v-if="providerLoading(providerName)"
              icon="spinner"
              class="animate-spin"
            />
            <span
              v-else
              class="text-shadow-sm font-bold tracking-wider"
              :class="
                providerSuccess(providerName)
                  ? 'text-emerald-600'
                  : 'text-rose-700'
              "
            >
              {{
                providerSuccess(providerName) || !providerError(providerName)
                  ? providerEmoteCount(providerName)
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
            :class="totalEmoteCount ? 'text-emerald-600' : 'text-rose-700'"
            >{{ totalEmoteCount }}</span
          >
        </div>
        <div class="text-gray-400 font-light text-2xl px-2">
          (<span class="font-normal">{{ totalUniqueEmoteCodes }}</span>
          unique codes)
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

type ProviderStatusFunction = { (provider: string): boolean };

export default defineComponent({
  name: "EmotesFromProvidersSummary",
  props: {
    channelName: {
      type: String,
      default: "",
    },
    profileImageURL: {
      type: String,
      default: "",
    },
    providerList: {
      type: Object as PropType<string[]>,
      required: true,
    },
    providerLoading: {
      type: Function as PropType<ProviderStatusFunction>,
      required: true,
    },
    providerSuccess: {
      type: Function as PropType<ProviderStatusFunction>,
      required: true,
    },
    providerError: {
      type: Function as PropType<ProviderStatusFunction>,
      required: true,
    },
    providerEmoteCount: {
      type: Function as PropType<{ (provider: string): number }>,
      required: true,
    },
    totalEmoteCount: {
      type: Number,
      default: 0,
    },
    totalUniqueEmoteCodes: {
      type: Number,
      default: 0,
    },
  },
});
</script>
