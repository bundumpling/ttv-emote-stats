<template>
  <ul class="emote-list box">
    <div class="header">
      <span
        class="pagePrevious"
        :class="hasPrevPage ? '' : 'hidden'"
        @click="hasPrevPage ? prevPage() : null"
        ><font-awesome-icon icon="chevron-left"
      /></span>
      <h2 class="emote-list-type">
        {{ emoteListProvider }}
      </h2>
      <span
        class="pageNext"
        :class="hasNextPage ? '' : 'hidden'"
        @click="hasNextPage ? nextPage() : null"
        ><font-awesome-icon icon="chevron-right"
      /></span>
    </div>
    <EmoteListItem
      v-for="emote in filteredByRank"
      v-bind:key="emote.name"
      :name="emote.name"
      :rank="emote.rank"
      :image="emote.image"
      :count="emote.count"
      :usedBy="emote.usedBy"
    />
    <div class="placeholder" v-if="!filteredByRank.length">
      <span>No Results</span>
    </div>
  </ul>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";

import EmoteListItem from "./EmoteListItem.vue";

export default defineComponent({
  name: "EmoteList",
  props: {
    emoteListProvider: String,
    emoteList: Array,
    pageNumber: Number,
    emotesPerPage: Number,
    rangeStart: Number,
    rangeEnd: Number,
    searchInputValue: String,
  },
  components: {
    EmoteListItem,
  },
  setup(props) {
    const store = useStore();
    const hasPrevPage = computed(
      () => store.state.emoteListPageNumbers[props.emoteListProvider] > 0
    );
    const hasNextPage = computed(
      () =>
        props.emoteList.length >
        store.state.emotesPerPage *
          (store.state.emoteListPageNumbers[props.emoteListProvider] + 1)
    );
    const filteredByRank = computed(() => {
      return props.emoteList.filter(
        (_, rank) => props.rangeStart <= rank + 1 && rank < props.rangeEnd
      );
    });
    const prevPage = () => {
      store.commit(MutationType.PrevPage, props.emoteListProvider);
    };
    const nextPage = () => {
      store.commit(MutationType.NextPage, props.emoteListProvider);
    };

    return {
      filteredByRank,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  },
});
</script>

<style lang="scss" scoped>
.placeholder {
  width: 20em;
  text-align: center;

  span {
    font-size: 1.5em;
    color: red;
    font-variant: small-caps;
  }
}
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
