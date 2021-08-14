<template>
  <div class="emote-list-container">
    <EmoteList
      v-for="emoteListProvider in [
        'Overall',
        ...Object.keys(countsSortedThenGroupedByProvider),
      ]"
      v-bind:key="emoteListProvider"
      :pageNumber="getPageNumber(emoteListProvider)"
      :emotesPerPage="getEmotesPerPage"
      :emoteListProvider="emoteListProvider"
      :emoteList="
        emoteListProvider === 'Overall'
          ? countsSorted
          : countsSortedThenGroupedByProvider[emoteListProvider]
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
    countsSortedThenGroupedByProvider() {
      let result = {};

      this.countsSorted.forEach((e) => {
        if (!result[e.provider]) {
          result[e.provider] = [];
        }
        result[e.provider].push(e);
      });
      return result;
    },
  },
  methods: {
    getPageNumber(emoteListProvider) {
      return this.$store.state.emoteListPageNumbers[emoteListProvider];
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