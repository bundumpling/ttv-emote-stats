<template>
  <TheHeader />
  <Subheader msg="Rankings" />
  <RankingsEmotesPerPageSelect />
  <TabsContainer />
  <EmoteListContainer />
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import Subheader from "../components/Subheader.vue";
import RankingsEmotesPerPageSelect from "../components/RankingsEmotesPerPageSelect.vue";
import TabsContainer from "../components/RankingsTabsContainer.vue";
import EmoteListContainer from "../components/RankingsEmoteListContainer.vue";

export default {
  name: "RankingsPage",
  components: {
    TheHeader,
    Subheader,
    RankingsEmotesPerPageSelect,
    TabsContainer,
    EmoteListContainer,
  },
};
</script>

<style>
</style>