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
      :key="emote.code"
      :code="emote.code"
      :state-index="emote.stateIndex"
      :rank="emote.rank"
      :image="emote.image"
      :count="emote.count"
      :used-by="emote.usedBy"
      :get-emote-details="() => getEmoteDetails(emote, emoteListProvider)"
    />
    <div v-if="!filteredByRank.length" class="placeholder">
      <span>No Results</span>
    </div>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject, ComputedRef } from "vue";
import { ChannelState, EmoteFromList } from "@/types";

import EmoteListItem from "./ChannelEmoteListItem.vue";

export default defineComponent({
  name: "ChannelEmoteList",
  components: {
    EmoteListItem,
  },
  props: {
    emoteListProvider: {
      type: String,
      default: ''
    },
    emoteList: {
      type: Array,
      default: null
    },
    pageNumber: {
      type: Number,
      default: 0
    },
    emotesPerPage: {
      type: Number,
      default: 10
    },
    rangeStart: {
      type: Number,
      default: 0
    },
    rangeEnd: { 
      type: Number, 
      default: 10 
    },
    searchInputValue: { 
      type: String, 
      default: '' 
    }
  },
  setup(props) {

    const state = inject('state') as ChannelState;
    const getEmoteDetails = inject('getEmoteDetails') as (emote: EmoteFromList, emoteListProvider: string) => void;

    const page = ref(0);

    const hasPrevPage = computed(() => page.value > 0);
    const hasNextPage = computed(
      () => {
        if (props && props.emoteList && props.emoteList.length) {
          return props.emoteList.length > state.emotesPerPage * (page.value + 1)
        } else {
          return false;
        }
      }
    );
    const filteredByRank = computed(() => {
      if (props && props.emoteList) {
        return props.emoteList.filter(
          (_, rank) =>
            state.emotesPerPage * page.value <= rank &&
            rank < state.emotesPerPage * (page.value + 1)
        );
      } else {
        return [];
      }
    }) as  ComputedRef<EmoteFromList[]>;
    const prevPage = () => {
      page.value--;
    };
    const nextPage = () => {
      page.value++;
    };

    return {
      filteredByRank,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      getEmoteDetails
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