<template>
  <div class="container columns">
    <EmoteList
      class="column is-one-fourth"
      :emoteListType="'Overall'"
      :emoteList="countsSorted"
    >
    </EmoteList>
    <EmoteList
      class="column is-one-fourth"
      v-for="emoteListType in Object.keys(countsSortedThenGroupedByType)"
      v-bind:key="emoteListType"
      :emoteListType="emoteListType"
      :emoteList="countsSortedThenGroupedByType[emoteListType]"
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
    countsSorted() {
      let clone = this.sharedState.seedData.slice(); // avoid side effects in computed props
      return clone.sort((a, b) => b.count - a.count);
    },
    countsSortedThenGroupedByType() {
      const result = {
        Twitch: [],
        FFZ: [],
        BTTV: [],
      };

      this.countsSorted.forEach((e) => {
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