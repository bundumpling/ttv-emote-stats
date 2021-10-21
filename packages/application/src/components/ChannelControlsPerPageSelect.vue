<template>
  <div class="flex justify-center items-baseline">
    <label
      class="
        px-2
        text-lg
        font-semibold
        text-dark-100
        whitespace-nowrap
        select-none
      "
      >Emotes per page
    </label>
    <select
      class="
        pl-1
        min-h-6
        border-cool-gray-300
        rounded-md
        border-1
        font-semibold font-mono
        shadow-indigo-400 shadow-md
        focus:outline-none
      "
      @change="switchSelect($event)"
    >
      <option :value="10" :selected="isSelected(10)">10</option>
      <option :value="25" :selected="isSelected(25)">25</option>
      <option :value="50" :selected="isSelected(50)">50</option>
      <option
        :value="Number.MAX_SAFE_INTEGER"
        :selected="isSelected(Number.MAX_SAFE_INTEGER)"
      >
        ALL
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { ChannelState } from "@/types";
import { defineComponent, inject } from "vue";
export default defineComponent({
  name: "ChannelControlsPerPageSelect",
  setup() {
    const state = inject("state") as ChannelState;

    function isSelected(value: number) {
      return state.emotesPerPage === value;
    }

    function switchSelect(event: Event) {
      const target = event.target as HTMLInputElement;
      const value = Number(target.value);
      state.setEmotesPerPage(value);
    }

    return {
      isSelected,
      switchSelect,
    };
  },
});
</script>
