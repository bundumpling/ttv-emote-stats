<template>
  <div class="emote-list-container">
    <EmoteList
      v-for="emoteListProvider in filterEmoteLists"
      v-bind:key="emoteListProvider"
      :pageNumber="getPageNumber(emoteListProvider)"
      :emotesPerPage="emotesPerPage"
      :rangeStart="getRangeStart(emoteListProvider)"
      :rangeEnd="getRangeEnd(emoteListProvider)"
      :searchInputValue="searchInputValue"
      :emoteListProvider="emoteListProvider"
      :emoteList="
        emoteListProvider === 'Overall'
          ? countsSorted
          : countsByProviderSorted[emoteListProvider]
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
    filterEmoteLists() {
      return this.$store.state.rankings.activeTab === "Overall"
        ? ["Overall"].concat(
            ["Twitch", "FFZ", "BTTV", "7TV"].filter(
              (provider) =>
                this.$store.state.channel.hasEmotesFrom[provider] === true
            )
          )
        : [this.$store.state.rankings.activeTab];
    },
    searchInputValue() {
      return this.$store.state.rankings.searchInput;
    },
    emotesPerPage() {
      return this.$store.state.emotesPerPage;
    },
    countsSorted() {
      // clone avoid side effects in computed props
      let clone = this.$store.state.channel.emotes.slice();
      return clone
        .sort((a, b) => b.count - a.count)
        .map((emote, rank) => {
          return { ...emote, rank };
        })
        .filter((emote) =>
          this.searchInputValue.length
            ? emote.name
                .toLowerCase()
                .includes(this.searchInputValue.toLowerCase())
            : emote
        );
    },
    countsSortedThenGroupedByProvider() {
      let result = {
        Twitch: [],
        FFZ: [],
        BTTV: [],
        "7TV": [],
      };

      this.countsSorted.forEach((e) => {
        if (!result[e.provider]) {
          result[e.provider] = [];
        }
        result[e.provider].push(e);
      });
      return result;
    },
    countsByProviderSorted() {
      let clone = this.$store.state.channel.emotes.slice();
      let sortedByProvider = clone
        .sort((a, b) => b.count - a.count)
        .reduce(
          (result, emote) => {
            result[emote.provider].push({
              ...emote,
              rank: result[emote.provider].length,
            });
            return result;
          },
          {
            Twitch: [],
            FFZ: [],
            BTTV: [],
            "7TV": [],
          }
        );
      let result = {};
      Object.keys(sortedByProvider).forEach((provider) => {
        result[provider] = sortedByProvider[provider].filter((emote) =>
          this.searchInputValue.length
            ? emote.name
                .toLowerCase()
                .includes(this.searchInputValue.toLowerCase())
            : emote
        );
      });
      return result;
    },
  },
  methods: {
    getPageNumber(emoteListProvider) {
      return this.$store.state.emoteListPageNumbers[emoteListProvider];
    },
    getRangeStart(emoteListProvider) {
      return (
        this.$store.state.emotesPerPage *
          this.$store.state.emoteListPageNumbers[emoteListProvider] +
        1
      );
    },
    getRangeEnd(emoteListProvider) {
      return (
        this.$store.state.emotesPerPage *
        (this.$store.state.emoteListPageNumbers[emoteListProvider] + 1)
      );
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