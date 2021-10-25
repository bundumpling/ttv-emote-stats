<template>
  <div class="flex justify-center items-center">
    <span
      class="
        py-1
        px-2
        mx-4
        font-inconsolata font-extrabold
        tracking-wide
        text-red-700
        bg-red-50
        border-2 border-red-700
        rounded-md
      "
      >Warning</span
    >
    <div class="flex flex-col">
      <div class="p-1 font-bold">
        {{ duplicateEmotesByCode.size }} emote codes have duplicate entries from
        providers.
      </div>
      <div class="p-1 font-bold">
        Since usage is tracked by emote code,
        <u>only one provider's instance will be stored</u>.
      </div>
      <div class="p-1 font-bold">
        Provider precedence is:
        <span class="pl-1 font-inconsolata font-bold tracking-wider">{{
          providerList.join(" -> ")
        }}</span>
      </div>
    </div>
  </div>
  <ul class="my-4 flex justify-evenly flex-wrap items-stretch">
    <li
      v-for="[duplicateCode, emotes] in duplicateEmotesByCode"
      :key="duplicateCode"
      class="m-2 flex justify-evenly border-2 border-light-600 rounded-md p-2"
    >
      <div class="p-2 flex flex-col items-center">
        <img
          class="w-8 flex"
          :src="emotes[0].image"
          :alt="`${duplicateCode} from ${emotes[0].provider}`"
        />
        <div class="font-inconsolata font-semibold tracking-wider">
          {{ duplicateCode }}
        </div>
      </div>
      <ul class="flex flex-col justify-evenly">
        <li
          v-for="(emote, index) in emotes"
          :key="`${emote.code}-${emote.provider}`"
          class="p-1 font-bold tracking-wide text-center"
          :class="index === 0 ? 'border-2 border-green-500 rounded-md' : ''"
        >
          {{ emote.provider }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import { Emote } from "@ttv-emote-stats/common";
import { defineComponent, PropType } from "vue";
import { providerList } from "@/composables/useEmotesFromProviders";
export default defineComponent({
  name: "DuplicateEmoteCodesSummary",
  props: {
    duplicateEmotesByCode: {
      type: Object as PropType<Map<string, Emote[]>>,
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
