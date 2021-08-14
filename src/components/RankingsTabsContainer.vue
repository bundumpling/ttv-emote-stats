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

<script>
import RankingsTab from "./RankingsTab.vue";
export default {
  name: "RankingsTabsContainer",
  computed: {
    filterTabs() {
      return ["Twitch", "FFZ", "BTTV", "7TV"].filter(
        (provider) => this.$store.state.channel.hasEmotesFrom[provider] === true
      );
    },
  },
  components: {
    RankingsTab,
  },
};
</script>

<style>
</style>