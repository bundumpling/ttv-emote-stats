<template>
  <div class="tabs is-large is-centered">
    <ul>
      <RankingsTab tabName="Overall" />
      <RankingsTab
        v-for="provider in filterTabs"
        v-bind:key="provider"
        :tabName="provider"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import RankingsTab from "./RankingsTab.vue";

export default defineComponent({
  name: "RankingsTabsContainer",
  components: {
    RankingsTab,
  },
  setup() {
    const store = useStore();

    const filterTabs = computed(() => {
      return ["Twitch", "FFZ", "BTTV", "7TV"].filter(
        (provider) => store.state.channel.hasEmotesFrom[provider] === true
      );
    });

    return {
      filterTabs,
    };
  },
});
</script>

<style>
</style>