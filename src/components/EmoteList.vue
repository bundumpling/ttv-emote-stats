<template>
  <ul class="emote-list box">
    <div class="header">
      <span
        class="pagePrevious"
        :class="hasPrevPage() ? '' : 'hidden'"
        @click="hasPrevPage() ? prevPage() : null"
        ><font-awesome-icon icon="chevron-left"
      /></span>
      <h2 class="emote-list-type">
        {{ emoteListProvider }}
      </h2>
      <span
        class="pageNext"
        :class="hasNextPage() ? '' : 'hidden'"
        @click="hasNextPage() ? nextPage() : null"
        ><font-awesome-icon icon="chevron-right"
      /></span>
    </div>
    <EmoteListItem
      v-for="emote in sortedByCountFilteredByRank"
      v-bind:key="emote.name"
      :name="emote.name"
      :rank="emote.rank"
      :image="emote.image"
      :count="emote.count"
    >
    </EmoteListItem>
  </ul>
</template>

<script>
import EmoteListItem from "./EmoteListItem.vue";

export default {
  name: "EmoteList",
  props: {
    emoteListProvider: String,
    emoteList: Array,
    pageNumber: Number,
    emotesPerPage: Number,
    rangeStart: Number,
    rangeEnd: Number,
  },
  components: {
    EmoteListItem,
  },
  computed: {
    sortedByCountFilteredByRank() {
      return this.emoteList
        .slice()
        .sort((a, b) => b.count - a.count)
        .map((emote, rank) => {
          return { ...emote, rank };
        })
        .filter((_, rank) => this.rangeStart <= rank && rank <= this.rangeEnd);
    },
  },
  methods: {
    hasPrevPage() {
      return this.$store.state.emoteListPageNumbers[this.emoteListProvider] > 0;
    },
    hasNextPage() {
      return (
        this.emoteList.length >
        this.$store.state.emotesPerPage *
          (this.$store.state.emoteListPageNumbers[this.emoteListProvider] + 1)
      );
    },
    prevPage() {
      if (this.hasPrevPage()) {
        this.$store.commit("prevPage", this.emoteListProvider);
      }
    },
    nextPage() {
      if (this.hasNextPage()) {
        this.$store.commit("nextPage", this.emoteListProvider);
      }
    },
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

ul {
  display: block;
  list-style: none;
}

.emote-list-type {
  font-size: 1.2em;
  user-select: none; /* prevent text selection highlighting when clicking the adjacent pagination buttons */
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 1em;
}

.hidden {
  visibility: hidden;
}

.box:last-child {
  margin-bottom: 1.5rem; /* bulma applies this bottom margin to not(:last-child) so this evens out box sizing */
}
</style>
