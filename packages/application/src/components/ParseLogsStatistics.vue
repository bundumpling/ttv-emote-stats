<template>
  <div
    class="
      flex-grow flex flex-col
      justify-evenly
      items-stretch
      text-center
      tracking-wide
    "
  >
    <div class="flex flex-col items-center">
      <h3 class="font-mono text-xl font-bold underline">Emotes Used</h3>
      <span class="text-2xl font-mono">{{
        `${stats.emotesUsed}/${stats.emotesTotal}`
      }}</span>
    </div>
    <div class="flex flex-col items-center">
      <h3 class="font-mono text-xl font-bold underline">Unique Users</h3>
      <span class="text-2xl font-mono">{{ stats.uniqueUsers }}</span>
    </div>
    <div class="flex flex-col items-center">
      <h3 class="font-mono text-xl font-bold underline">Total Usage Count</h3>
      <span class="text-2xl font-mono">{{ stats.totalUsageCount }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ParseLogsStatistics",
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
});
</script>
