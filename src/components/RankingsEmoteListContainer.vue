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

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import { IEmote, IEmoteInList } from "../types";
import EmoteList from "./EmoteList.vue";
export default defineComponent({
  name: "RankingsEmoteListContainer",
  components: {
    EmoteList,
  },
  setup() {
    const store = useStore();

    const filterEmoteLists = computed(() => {
      return store.state.rankings.activeTab === "Overall"
        ? ["Overall"].concat(
            ["Twitch", "FFZ", "BTTV", "7TV"].filter(
              (provider) => store.state.channel.hasEmotesFrom[provider] === true
            )
          )
        : [store.state.rankings.activeTab];
    });

    const searchInputValue = computed(() => {
      return store.state.rankings.searchInput;
    });

    const emotesPerPage = computed(() => {
      return store.state.emotesPerPage;
    });

    const countsSorted = computed(() => {
      // clone avoid side effects in computed props
      let clone = store.state.channel.emotes.slice();
      return clone
        .sort((a: IEmote, b: IEmote) => b.count - a.count)
        .map((emote: IEmote, rank: number) => {
          return { ...emote, rank: rank + 1 };
        })
        .filter((emote: IEmoteInList) =>
          searchInputValue.value.length
            ? emote.name
                .toLowerCase()
                .includes(searchInputValue.value.toLowerCase())
            : emote
        );
    });

    // const countsSortedThenGroupedByProvider = computed(() => {
    //   let result = {
    //     Twitch: [],
    //     FFZ: [],
    //     BTTV: [],
    //     "7TV": [],
    //   };
    //   countsSorted.value.forEach((e) => {
    //     if (!result[e.provider]) {
    //       result[e.provider] = [];
    //     }
    //     result[e.provider].push(e);
    //   });
    //   return result;
    // });

    const countsByProviderSorted = computed(() => {
      type tResult = {
        [key: string]: IEmoteInList[];
      };
      let clone = store.state.channel.emotes.slice();
      let sortedByProvider = clone
        .sort((a: IEmote, b: IEmote) => b.count - a.count)
        .reduce(
          (acc: tResult, emote: IEmote) => {
            acc[emote.provider].push({
              ...emote,
              rank: acc[emote.provider].length + 1,
            });
            return acc;
          },
          {
            Twitch: [],
            FFZ: [],
            BTTV: [],
            "7TV": [],
          }
        );
      let result: tResult = {};
      Object.keys(sortedByProvider).forEach((provider) => {
        result[provider] = sortedByProvider[provider].filter((emote: IEmote) =>
          searchInputValue.value.length
            ? emote.name
                .toLowerCase()
                .includes(searchInputValue.value.toLowerCase())
            : emote
        );
      });
      return result;
    });

    function getPageNumber(emoteListProvider: string) {
      return store.state.emoteListPageNumbers[emoteListProvider];
    }

    function getRangeStart(emoteListProvider: string) {
      return (
        store.state.emotesPerPage *
          store.state.emoteListPageNumbers[emoteListProvider] +
        1
      );
    }

    function getRangeEnd(emoteListProvider: string) {
      return (
        store.state.emotesPerPage *
        (store.state.emoteListPageNumbers[emoteListProvider] + 1)
      );
    }

    return {
      filterEmoteLists,
      searchInputValue,
      emotesPerPage,
      countsSorted,
      // countsSortedThenGroupedByProvider,
      countsByProviderSorted,
      getPageNumber,
      getRangeStart,
      getRangeEnd,
    };
  },
});
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