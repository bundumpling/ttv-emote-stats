<template>
  <ol id="emote-list" class="box">
    <EmoteListItem
      v-for="emote in randomizedCounts"
      v-bind:key="emote.name"
      :emote="emote"
    >
    </EmoteListItem>
  </ol>
</template>

<script>
import EmoteListItem from "./EmoteListItem.vue";
import { store } from "../store.js";

export default {
  name: "EmoteList",
  data() {
    return {
      sharedState: store.state,
    };
  },
  computed: {
    randomizedCounts() {
      return this.sharedState.seedData
        .map((e) => {
          e.count = Math.floor(Math.random() * 10000);
          return e;
        })
        .sort((a, b) => b.count - a.count);
    },
  },
  components: {
    EmoteListItem,
  },
};
</script>

<style lang="scss">
#emote-list {
  width: 200px;
  margin: 0 auto;
  list-style: none;
  counter-reset: count;
}
</style>
