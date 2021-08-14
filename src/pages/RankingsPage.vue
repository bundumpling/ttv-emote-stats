<template>
  <TheHeader />
  <Subheader msg="Rankings" />
  <EmoteGroupingMenu />
  <RankingsTabsContainer />
  <div class="emote-list-wrapper" v-if="showAll">
    <EmoteList
      :pageNumber="getPageNumber('Overall')"
      :emotesPerPage="getEmotesPerPage"
      :emoteListType="'Overall'"
      :emoteList="countsSorted"
    />
  </div>
  <div class="emote-list-wrapper" v-if="!showAll">
    <EmoteList
      v-for="emoteListType in Object.keys(countsSortedThenGroupedByType)"
      v-bind:key="emoteListType"
      :pageNumber="getPageNumber(emoteListType)"
      :emotesPerPage="getEmotesPerPage"
      :emoteListType="emoteListType"
      :emoteList="countsSortedThenGroupedByType[emoteListType]"
    />
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import Subheader from "../components/Subheader.vue";
import RankingsTabsContainer from "../components/RankingsTabsContainer.vue";
import EmoteList from "../components/EmoteList.vue";
import EmoteGroupingMenu from "../components/EmoteGroupingMenu.vue";

export default {
  name: "RankingsPage",
  computed: {
    showAll() {
      return this.$store.state.emoteGroupingMenuShowAll;
    },
    getEmotesPerPage() {
      return this.$store.state.emotesPerPage;
    },
    countsSorted() {
      // clone avoid side effects in computed props
      let clone = this.$store.state.channel.emotes.slice();
      return clone.sort((a, b) => b.count - a.count);
    },
    countsSortedThenGroupedByType() {
      let result = {};

      this.countsSorted.forEach((e) => {
        if (!result[e.type]) {
          result[e.type] = [];
        }
        result[e.type].push(e);
      });
      return result;
    },
  },
  methods: {
    getPageNumber(emoteListType) {
      return this.$store.state.emoteListPageNumbers[emoteListType];
    },
  },
  components: {
    TheHeader,
    Subheader,
    RankingsTabsContainer,
    EmoteList,
    EmoteGroupingMenu,
  },
};
</script>

<style>
.emote-list-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: flex-start;
  align-items: stretch;
}
</style>