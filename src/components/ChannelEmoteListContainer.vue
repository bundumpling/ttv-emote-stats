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
import { defineComponent, computed, inject } from "vue";
import { ChannelState, Emote, EmoteInList } from "../types";

import EmoteList from "./ChannelEmoteList.vue";
import EmoteDetails from "./ChannelEmoteDetailsModal.vue";

export default defineComponent({
  name: "ChannelEmoteListContainer",
  components: {
    EmoteList,
    EmoteDetails,
  },
  setup() {
    const state = inject('state') as ChannelState;

    const emoteDetailsModalOpen = computed(() => {
      return state.emoteDetailsModalOpen;
    });

    const filterEmoteLists = computed(() => {
      return ["Overall"].concat(
        ["Twitch", "FFZ", "BTTV", "7TV"].filter(
          (provider) => state.hasEmotesFrom[provider] === true
        )
      );
    });

    const emoteSearchInput = computed(() => {
      return state.emoteSearchInput;
    });

    const countsSorted = computed(() => {
      return state.emotes
        .map((emote: Emote, index: number) => {
          return { ...emote, stateIndex: index };
        })
        .sort((a: Emote, b: Emote) => (b.count || 0) - (a.count || 0))
        .map((emote: Emote, rank: number) => {
          return {
            ...emote,
            rank: rank + 1,
            // usedBySorted: sortByUsed(emote.usedBy),
          };
        })
        .filter((emote: EmoteInList) =>
          emoteSearchInput.value.length
            ? emote.code
                .toLowerCase()
                .includes(emoteSearchInput.value.toLowerCase())
            : emote
        );
    });

    const countsByProviderSorted = computed(() => {
      type tResult = {
        [key: string]: EmoteInList[];
      };
      let emotesWithStateIndex = state.emotes.map(
        (emote: Emote, index: number) => ({ stateIndex: index, ...emote })
      );
      let sortedByProvider = emotesWithStateIndex
        .sort((a: Emote, b: Emote) => (b.count || 0) - (a.count || 0))
        .reduce(
          (acc: tResult, emote: Emote) => {
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
        result[provider] = sortedByProvider[provider].filter((emote: Emote) =>
          emoteSearchInput.value.length
            ? emote.code
                .toLowerCase()
                .includes(emoteSearchInput.value.toLowerCase())
            : emote
        );
      });
      return result;
    });

    return {
      filterEmoteLists,
      emoteSearchInput,
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