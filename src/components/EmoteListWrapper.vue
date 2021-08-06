<template>
  <div class="container columns">
    <EmoteList
      class="column is-one-third"
      v-for="emoteListType in Object.keys(
        countsRandomizedThenSortedThenGroupedByType
      )"
      v-bind:key="emoteListType"
      :emoteListType="emoteListType"
      :emoteList="countsRandomizedThenSortedThenGroupedByType[emoteListType]"
    >
    </EmoteList>
  </div>
</template>

<script>
import EmoteList from "./EmoteList.vue";
import { store } from "../store.js";

export default {
  name: "EmoteListWrapper",
  data() {
    return {
      sharedState: store.state,
    };
  },
  computed: {
    countsRandomizedThenSortedThenGroupedByType() {
      const result = {
        Twitch: [],
        FFZ: [],
        BTTV: [],
      };

      this.sharedState.seedData
        .map((e) => {
          e.count = Math.floor(Math.random() * 10000);
          return e;
        })
        .sort((a, b) => b.count - a.count)
        .forEach((e) => {
          result[e.type].push(e);
        });
      return result;
    },
  },
  components: {
    EmoteList,
  },
};
</script>


<style>
</style>