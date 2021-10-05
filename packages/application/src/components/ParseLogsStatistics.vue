<template>
  <div class="stats">
    <div class="stats-item">
      <h4>Emotes Used</h4>
      <span>{{ `${stats.emotesUsed}/${stats.emotesTotal}` }}</span>
    </div>
    <div class="stats-item">
      <h4>Unique Users</h4>
      <span>{{ stats.uniqueUsers }}</span>
    </div>
    <div class="stats-item">
      <h4>Total Usage Count</h4>
      <span>{{ stats.totalUsageCount }}</span>
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

<style lang="scss">
.stats {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
  text-align: center;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  & > h4 {
    font-family: monospace;
    font-size: 1.5em;
    font-weight: bold;
    text-decoration: underline;
  }

  & > span {
    font-size: 2em;
    font-family: monospace;
  }
}
</style>