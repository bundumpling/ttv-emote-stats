<template>
  <div class="emote-list-container">
    <EmoteList
      v-for="emoteListProvider in filterEmoteLists"
      v-bind:key="emoteListProvider"
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

import EmoteList from "./ChannelEmoteList.vue";
import EmoteDetails from "./ChannelEmoteDetailsModal.vue";

export default defineComponent({
  name: "ChannelEmoteListContainer",
  components: {
    EmoteList,
    EmoteDetails,
  },
  setup() {
    const store = useStore();

    const emoteDetailsModalOpen = computed(() => {
      return store.state.channel.emoteDetailsModalOpen;
    });

    const filterEmoteLists = computed(() => {
      return ["Overall"].concat(
        ["Twitch", "FFZ", "BTTV", "7TV"].filter(
          (provider) => store.state.channel.hasEmotesFrom[provider] === true
        )
      );
    });

    const searchInputValue = computed(() => {
      return store.state.channel.searchInput;
    });

    const countsSorted = computed(() => {
      return store.state.channel.emotes
        .map((emote: IEmote, index: number) => {
          return { ...emote, stateIndex: index };
        })
        .sort((a: IEmote, b: IEmote) => (b.count || 0) - (a.count || 0))
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

    const countsByProviderSorted = computed(() => {
      type tResult = {
        [key: string]: IEmoteInList[];
      };
      let emotesWithStateIndex = store.state.channel.emotes.map(
        (emote: IEmote, index: number) => ({ stateIndex: index, ...emote })
      );
      let sortedByProvider = emotesWithStateIndex
        .sort((a: IEmote, b: IEmote) => (b.count || 0) - (a.count || 0))
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

    return {
      filterEmoteLists,
      searchInputValue,
      countsSorted,
      countsByProviderSorted,
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