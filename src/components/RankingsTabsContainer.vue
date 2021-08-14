<template>
  <div class="tabs is-large is-centered">
    <ul>
      <RankingsTab tabName="Overall" />
      <RankingsTab tabName="Categorical" />
      <RankingsTab v-if="showTab('Twitch')" tabName="Twitch" />
      <RankingsTab v-if="showTab('FFZ')" tabName="FFZ" />
      <RankingsTab v-if="showTab('BTTV')" tabName="BTTV" />
      <RankingsTab v-if="showTab('7TV')" tabName="7TV" />
    </ul>
  </div>
</template>

<script>
import RankingsTab from "./RankingsTab.vue";
export default {
  name: "RankingsTabsContainer",
  methods: {
    showTab(tabName) {
      return this.$store.state.providerAvailability[tabName] === true;
    },
  },
  components: {
    RankingsTab,
  },
};
</script>

<style>
</style>