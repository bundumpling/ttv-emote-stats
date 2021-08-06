<template>
  <ol id="emote-list">
    <EmoteListItem
      v-for="emote in sharedState.seedData"
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
  components: {
    EmoteListItem,
  },
};
</script>

<style lang="scss">
#emote-list {
  list-style: none;
  counter-reset: count;
}
</style>
