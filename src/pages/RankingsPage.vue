<template>
  <TheHeader />
  <Subheader msg="Rankings" />
  <EmoteGroupingMenu />
  <div class="emote-list-wrapper" v-if="showAll">
    <EmoteList
      :emotesPerPage="getEmotesPerPage"
      :emoteListType="'Overall'"
      :emoteList="countsSorted"
    />
  </div>
  <div class="emote-list-wrapper" v-if="!showAll">
    <EmoteList
      v-for="emoteListType in Object.keys(countsSortedThenGroupedByType)"
      v-bind:key="emoteListType"
      :emotesPerPage="getEmotesPerPage"
      :emoteListType="emoteListType"
      :emoteList="countsSortedThenGroupedByType[emoteListType]"
    />
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import Subheader from "../components/Subheader.vue";
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
      const result = {
        Twitch: [],
        FFZ: [],
        BTTV: [],
        "7TV": [],
      };

      this.countsSorted.forEach((e) => {
        result[e.type].push(e);
      });
      return result;
    },
  },
  components: {
    TheHeader,
    Subheader,
    EmoteList,
    EmoteGroupingMenu,
  },
};
</script>

<style>
.emote-list-wrapper {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-content: flex-start;
  align-items: stretch;
}
</style>