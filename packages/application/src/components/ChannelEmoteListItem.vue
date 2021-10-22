<template>
  <li
    class="
      group
      h-6
      text-xl
      mb-1
      flex flex-nowrap
      items-center
      cursor-pointer
      hover:bg-cool-gray-200
    "
    @click="count ? getEmoteDetails() : null"
  >
    <div class="text-center w-8 font-bold">{{ rank }}</div>
    <div
      class="
        w-full
        pl-3
        justify-between
        items-center
        self-stretch
        flex
        group-hover:z-20
        group-hover:overflow-clip
        group-hover:whitespace-normal
        group-hover:break-all
      "
    >
      <div class="w-6 h-6">
        <img :alt="code" :src="image" />
      </div>
      <div
        class="
          max-w-40
          z-10
          px-1
          whitespace-nowrap
          overflow-hidden overflow-ellipsis
          text-sm
          font-mono
          group-hover:z-20
          group-hover:overflow-clip
          group-hover:whitespace-normal
          group-hover:break-all
        "
      >
        <span>{{ code }}</span>
      </div>
      <div class="text-right font-mono">
        {{ count }}
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChannelEmoteListItem",
  props: {
    code: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    stateIndex: {
      type: Number,
      required: true,
    },
    usedBy: {
      type: Object,
      default: {} as { [key: string]: number },
    },
    getEmoteDetails: {
      type: Function,
      required: true,
    },
  },
});
</script>
