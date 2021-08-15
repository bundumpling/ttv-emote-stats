<template>
  <TheHeader />
  <Subheader :msg="`Channel Emote Rankings for ${channelName}`" />
  <RankingsListControls />
  <TabsContainer />
  <EmoteListContainer />
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import Subheader from "../components/Subheader.vue";
import RankingsListControls from "../components/RankingsListControls.vue";
import TabsContainer from "../components/RankingsTabsContainer.vue";
import EmoteListContainer from "../components/RankingsEmoteListContainer.vue";

export default {
  name: "RankingsPage",
  components: {
    TheHeader,
    Subheader,
    RankingsListControls,
    TabsContainer,
    EmoteListContainer,
  },
  computed: {
    channelName() {
      return this.$store.state.channel.name;
    },
  },
};
</script>

<style>
</style>