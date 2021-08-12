<template>
  <TheHeader />
  <Subheader msg="Rankings" />
  <EmoteGroupingMenu />
  <div class="container columns" v-if="showAll">
    <EmoteList
      class="column is-4 is-offset-3"
      :emotesPerPage="getEmotesPerPage"
      :emoteListType="'Overall'"
      :emoteList="countsSorted"
    >
    </EmoteList>
  </div>
  <div class="container columns" v-if="!showAll">
    <EmoteList
      class="column is-one-fourth"
      v-for="emoteListType in Object.keys(countsSortedThenGroupedByType)"
      v-bind:key="emoteListType"
      :emotesPerPage="getEmotesPerPage"
      :emoteListType="emoteListType"
      :emoteList="countsSortedThenGroupedByType[emoteListType]"
    >
    </EmoteList>
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
</style>