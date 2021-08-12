<template>
  <ol id="emote-list" class="box">
    <div class="header columns">
      <span class="pagePrevious column is-1" @click="prevPage()"
        ><font-awesome-icon icon="chevron-left" v-if="hasPrevPage()"
      /></span>
      <h2 class="emote-list-type subtitle column is-10">{{ emoteListType }}</h2>
      <span class="pageNext column is-1" @click="nextPage()"
        ><font-awesome-icon icon="chevron-right" v-if="hasNextPage()"
      /></span>
    </div>
    <EmoteListItem
      v-for="(emote, index) in sortByCount(emoteList)"
      v-bind:key="emote.name"
      :emote="emote"
      :index="index + 1"
      :rangeStart="emotesPerPage * pageNumber + 1"
      :rangeEnd="emotesPerPage * (pageNumber + 1)"
    >
    </EmoteListItem>
  </ol>
</template>

<script>
import EmoteListItem from "./EmoteListItem.vue";

export default {
  name: "EmoteList",
  data() {
    return {
      pageNumber: 0,
    };
  },
  props: ["emoteListType", "emoteList", "emotesPerPage"],
  methods: {
    sortByCount(list) {
      return list.sort((a, b) => b.count - a.count);
    },
    hasPrevPage() {
      return this.pageNumber > 0;
    },
    hasNextPage() {
      return this.emoteList.length > this.emotesPerPage * (this.pageNumber + 1);
    },
    prevPage() {
      if (this.hasPrevPage()) {
        this.pageNumber--;
      }
    },
    nextPage() {
      if (this.hasNextPage()) {
        this.pageNumber++;
      }
    },
  },
  components: {
    EmoteListItem,
  },
};
</script>

<style lang="scss">
#emote-list {
  margin: 0 auto;
  list-style: none;
  counter-reset: count;
}

#emote-list h2 {
  text-align: center;
}

.emote-list-type {
  user-select: none; /* prevent text selection highlighting when clicking the adjacent pagination buttons */
}
</style>
