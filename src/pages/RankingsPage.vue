<template>
  <TheHeader />
  <Subheader msg="Rankings" />
  <EmoteGroupingMenu />
  <div class="container columns" v-if="showAll">
    <EmoteList
      class="column is-4 is-offset-3"
      :emoteListType="'Overall'"
      :emoteList="countsSorted"
    >
    </EmoteList>
  </div>
  <div class="container columns" v-if="!showAll">
    <EmoteList
      class="column is-one-third"
      v-for="emoteListType in Object.keys(countsSortedThenGroupedByType)"
      v-bind:key="emoteListType"
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
import { store } from "../store.js";

export default {
  name: "RankingsPage",
  data() {
    return {
      sharedState: store.state,
    };
  },
  computed: {
    showAll() {
      return store.state.emoteGroupingMenuShowAll;
    },
    countsSorted() {
      let clone = this.sharedState.seedData.slice(); // avoid side effects in computed props
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