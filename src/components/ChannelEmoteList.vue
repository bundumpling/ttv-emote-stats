<template>
  <ul class="emote-list box">
    <div class="header">
      <span
        class="pagePrevious"
        :class="hasPrevPage ? 'is-clickable' : 'hidden'"
        @click="hasPrevPage ? prevPage() : null"
        ><font-awesome-icon icon="chevron-left"
      /></span>
      <h2 class="emote-list-type">
        {{ emoteListProvider }}
      </h2>
      <span
        class="pageNext"
        :class="hasNextPage ? 'is-clickable' : 'hidden'"
        @click="hasNextPage ? nextPage() : null"
        ><font-awesome-icon icon="chevron-right"
      /></span>
    </div>
    <EmoteListItem
      v-for="emote in filteredByRank"
      v-bind:key="emote.code"
      :code="emote.code"
      :stateIndex="emote.stateIndex"
      :rank="emote.rank"
      :image="emote.image"
      :count="emote.count"
      :usedBy="emote.usedBy"
      :showEmoteDetails="() => showEmoteDetails({ emote, emoteListProvider })"
    />
    <div class="placeholder" v-if="!filteredByRank.length">
      <span>No Results</span>
    </div>
  </ul>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../store";

import EmoteListItem from "./ChannelEmoteListItem.vue";

export default defineComponent({
  name: "ChannelEmoteList",
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

    const page = ref(0);

    const hasPrevPage = computed(() => page.value > 0);
    const hasNextPage = computed(
      () =>
        props.emoteList.length >
        store.state.channel.emotesPerPage * (page.value + 1)
    );
    const filteredByRank = computed(() => {
      return props.emoteList.filter(
        (_, rank) =>
          store.state.channel.emotesPerPage * page.value <= rank &&
          rank < store.state.channel.emotesPerPage * (page.value + 1)
      );
    });
    const prevPage = () => {
      page.value--;
    };
    const nextPage = () => {
      page.value++;
    };

    function showEmoteDetails({ emote, emoteListProvider }) {
      store.dispatch("fetchEmoteUsageDetails", { emote, emoteListProvider });
    }

    return {
      filteredByRank,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      showEmoteDetails,
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
