<template>
  <div
    class="
      m-4
      min-w-80
      bg-light-50
      border-4 border-gray-200
      rounded-lg
      list-none
      shadow-indigo-400 shadow-lg
    "
  >
    <div
      class="
        py-2
        px-2
        flex
        items-center
        justify-between
        flex-shrink-0
        border-b-2 border-gray-200
      "
    >
      <span
        class="min-w-6 text-center"
        :class="hasPrevPage ? 'cursor-pointer' : 'invisible'"
        @click="hasPrevPage ? prevPage() : null"
        ><font-awesome-icon icon="chevron-left"
      /></span>
      <h2
        class="
          flex-grow-1 flex-shrink-0
          text-2xl
          tracking-wide
          font-bold
          text-dark-100 text-shadow-sm
        "
      >
        {{ emoteListProvider }}
      </h2>
      <span
        class="min-w-6 text-center"
        :class="hasNextPage ? 'cursor-pointer' : 'invisible'"
        @click="hasNextPage ? nextPage() : null"
        ><font-awesome-icon icon="chevron-right"
      /></span>
    </div>
    <ul class="p-2">
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
      <div
        v-if="!filteredByRank.length"
        class="min-w-20 text-center font-bold text-rose-400 text-2xl"
      >
        <span>No Results</span>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  computed,
  ref,
  inject,
  ComputedRef,
} from "vue";
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
      default: "",
    },
    emoteList: {
      type: Array,
      default: null,
    },
    pageNumber: {
      type: Number,
      default: 0,
    },
    emotesPerPage: {
      type: Number,
      default: 10,
    },
    rangeStart: {
      type: Number,
      default: 0,
    },
    rangeEnd: {
      type: Number,
      default: 10,
    },
    searchInputValue: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const state = inject("state") as ChannelState;
    const getEmoteDetails = inject("getEmoteDetails") as (
      emote: EmoteFromList,
      emoteListProvider: string
    ) => void;

    const page = ref(0);

    watch(
      () => props.emoteList,
      () => (page.value = 0)
    );

    const hasPrevPage = computed(() => page.value > 0);
    const hasNextPage = computed(() => {
      if (props && props.emoteList && props.emoteList.length) {
        return props.emoteList.length > state.emotesPerPage * (page.value + 1);
      } else {
        return false;
      }
    });
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
    }) as ComputedRef<EmoteFromList[]>;
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
      getEmoteDetails,
    };
  },
});
</script>
