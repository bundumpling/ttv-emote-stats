<template>
  <div class="emote-list-container">
    <EmoteList
      v-for="emoteListType in [
        'Overall',
        ...Object.keys(countsSortedThenGroupedByType),
      ]"
      v-bind:key="emoteListType"
      :pageNumber="getPageNumber(emoteListType)"
      :emotesPerPage="getEmotesPerPage"
      :emoteListType="emoteListType"
      :emoteList="
        emoteListType === 'Overall'
          ? countsSorted
          : countsSortedThenGroupedByType[emoteListType]
      "
    />
  </div>
</template>

<script>
import EmoteList from "./EmoteList.vue";
export default {
  name: "RankingsEmoteListContainer",
  components: {
    EmoteList,
  },
  computed: {
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
};
</script>

<style>
.emote-list-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: flex-start;
  align-items: stretch;
}
</style>