<template>
  <ol class="emote-list box">
    <div class="header">
      <span
        class="pagePrevious"
        :class="hasPrevPage() ? '' : 'hidden'"
        @click="hasPrevPage() ? prevPage() : null"
        ><font-awesome-icon icon="chevron-left"
      /></span>
      <h2 class="emote-list-type">
        {{ emoteListType }}
      </h2>
      <span
        class="pageNext"
        :class="hasNextPage() ? '' : 'hidden'"
        @click="hasNextPage() ? nextPage() : null"
        ><font-awesome-icon icon="chevron-right"
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

<style lang="scss" scoped>
.emote-list {
  align-self: stretch;
  h2 {
    font-weight: bold;
  }
}

ol {
  display: block;
  list-style: none;
  counter-reset: count;
}

.emote-list-type {
  font-size: 1.2em;
  user-select: none; /* prevent text selection highlighting when clicking the adjacent pagination buttons */
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 1em;
}

.hidden {
  visibility: hidden;
}

.box:last-child {
  margin-bottom: 1.5rem; /* bulma applies this bottom margin to not(:last-child) so this evens out box sizing */
}
</style>
