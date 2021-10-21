<template>
  <div
    class="
      fixed
      absolute
      inset-0
      z-40
      flex flex-col
      items-center
      justify-center
      overflow-hidden
    "
  >
    <div
      class="absolute inset-0 bg-cool-gray-500 bg-opacity-50"
      @click="close()"
    ></div>
    <div
      class="
        overflow-auto
        relative
        w-screen-sm
        mx-auto
        shadow-2xl
        border-2 border-cool-gray-300
        rounded-lg
      "
    >
      <header
        class="
          relative
          flex
          items-center
          justify-between
          bg-cool-gray-50
          flex-shrink-0
          p-3
          border-b-2 border-cool-gray-300
        "
      >
        <img class="w-10 h-10" :src="image" :alt="code" />

        <div
          class="
            flex-grow-1 flex-shrink-0
            text-2xl
            tracking-wide
            text-shadow-sm
            overflow-x-hidden
          "
        >
          {{ code }}
        </div>
        <span aria-label="close" @click="close()"
          ><font-awesome-icon
            class="cursor-pointer text-rose-800 text-4xl shadow-sm"
            icon="window-close"
        /></span>
      </header>
      <section
        class="
          flex-grow-1 flex-shrink-1
          overflow-auto
          p-4
          bg-light-300
          border-b-2 border-cool-gray-300
          text-xl text-center
          tracking-wide
          text-dark-100
        "
      >
        <div>
          <span class="font-bold text-dark-300 text-shadow-sm"
            >#{{ rank }}</span
          >
          in {{ fromList }} Emotes
        </div>
        <div>
          Used
          <span class="font-bold text-dark-300 text-shadow-sm">{{
            count
          }}</span>
          times in
          <span class="font-semibold text-shadow-sm">{{ channelName }}</span
          >'s channel.
        </div>
        <div>
          Most used by
          <span class="font-semibold text-shadow-sm">{{
            mostUsedBy[0].username
          }}</span>
          a total of
          <span class="font-bold text-dark-300 text-shadow-sm">{{
            mostUsedBy[0].count
          }}</span>
          times!
        </div>
        <div>
          Most used on
          <span class="font-bold text-dark-300 text-shadow-sm">{{
            mostUsedOn.date
          }}</span>
          a total of
          <span class="font-bold text-dark-300 text-shadow-sm">{{
            mostUsedOn.count
          }}</span>
          times!
        </div>
      </section>
      <section
        class="
          flex-grow-1 flex-shrink-1
          overflow-auto
          p-4
          bg-light-300
          border-b-2 border-cool-gray-300
          flex flex-col
        "
      >
        <UsedByList
          :most-used-by="mostUsedBy"
          :user-search-input="userSearchInput"
        />
      </section>
      <footer class="h-8 flex items-center flex-shrink-0 p-3 bg-cool-gray-50" />
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelState } from "../types";
import { defineComponent, inject, computed, ComputedRef } from "vue";
import UsedByList from "./EmoteUsedByList.vue";

export default defineComponent({
  name: "ChannelEmoteDetailsModal",
  components: {
    UsedByList,
  },
  setup() {
    const state = inject("state") as ChannelState;

    const mostUsedOn = computed(() => {
      let result = { date: "", count: 0 };
      for (const dateKey in state.emoteDetails.usedOn) {
        const count = state.emoteDetails.usedOn[dateKey];
        if (count > result.count) {
          const year = Number(String(dateKey).slice(0, 4));
          const month = Number(String(dateKey).slice(4, 6)) - 1;
          const day = Number(String(dateKey).slice(6));
          const date = new Date(year, month, day);
          const dateString = date.toDateString();

          result = { date: dateString, count };
        }
      }
      return result;
    });

    const mostUsedBy: ComputedRef<
      {
        username: string;
        count: number;
        rank: number;
      }[]
    > = computed(() => {
      let result = [];
      for (const user in state.emoteDetails.usedBy) {
        const username = user.split("-")[0];
        const count = state.emoteDetails.usedBy[user];
        result.push({ username, count });
      }
      return result
        .sort((a, b) => b.count - a.count)
        .map((user, rank) => ({ rank, ...user }));
    });

    const userSearchInput = computed(() => state.userSearchInput);

    return {
      code: state.emoteDetails.code,
      count: state.emoteDetails.count,
      rank: state.emoteDetails.rank,
      image: state.emoteDetails.image,
      fromList: state.emoteDetails.fromList,
      mostUsedBy,
      usedOn: state.emoteDetails.usedOn,
      channelName: state.name,
      userSearchInput,
      mostUsedOn,
      close: () => state.closeEmoteDetailsModal(),
    };
  },
});
</script>
