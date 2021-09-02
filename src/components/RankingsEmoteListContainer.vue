<template>
  <div class="emote-list-container">
    <EmoteList
      v-for="emoteListProvider in filterEmoteLists"
      v-bind:key="emoteListProvider"
      :pageNumber="getPageNumber(emoteListProvider)"
      :emotesPerPage="emotesPerPage"
      :rangeStart="getRangeStart(emoteListProvider)"
      :rangeEnd="getRangeEnd(emoteListProvider)"
      :emoteListProvider="emoteListProvider"
      :emoteList="
        emoteListProvider === 'Overall'
          ? countsSorted
          : countsByProviderSorted[emoteListProvider]
      "
    />
  </div>
  <EmoteDetails v-if="emoteDetailsModalOpen" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import { IEmote, IEmoteInList } from "../types";

import EmoteList from "./RankingsEmoteList.vue";
import EmoteDetails from "./RankingsEmoteDetailsModal.vue";

export default defineComponent({
  name: "RankingsEmoteListContainer",
  components: {
    EmoteList,
    EmoteDetails,
  },
  setup() {
    const store = useStore();

    const emoteDetailsModalOpen = computed(() => {
      return store.state.rankings.emoteDetailsModalOpen;
    });

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
      return store.state.channel.emotes
        .map((emote: IEmote, index: number) => {
          return { ...emote, stateIndex: index };
        })
        .sort((a: IEmote, b: IEmote) => b.count - a.count)
        .map((emote: IEmote, rank: number) => {
          return {
            ...emote,
            rank: rank + 1,
            // usedBySorted: sortByUsed(emote.usedBy),
          };
        })
        .filter((emote: IEmoteInList) =>
          searchInputValue.value.length
            ? emote.code
                .toLowerCase()
                .includes(searchInputValue.value.toLowerCase())
            : emote
        );
    });

    //eslint-disable-next-line
    const sortByUsed = (usedByObj: any) => {
      let arr = Array.from(
        Object.keys(usedByObj).map((key) => [key, usedByObj[key]])
      );
      return arr.sort((a, b) => b[1] - a[1]);
    };

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
            ? emote.code
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
      emoteDetailsModalOpen,
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