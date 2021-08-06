<template>
  <ol id="emote-list" class="box">
    <h2 class="subtitle">{{ emoteListType }}</h2>
    <EmoteListItem
      v-for="emote in emoteList"
      v-bind:key="emote.name"
      :emote="emote"
    >
    </EmoteListItem>
  </ol>
</template>

<script>
import EmoteListItem from "./EmoteListItem.vue";

export default {
  name: "EmoteList",
  props: ["emoteListType", "emoteList"],
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

#emote-list h2 {
  text-align: center;
}
</style>
