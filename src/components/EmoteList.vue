<template>
  <ol id="emote-list" class="box">
    <h2 class="subtitle">Emote Stats</h2>
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
  width: 200px;
  margin: 0 auto;
  list-style: none;
  counter-reset: count;
}

h2 {
  font-variant: small-caps;
  text-align: center;
}
</style>
