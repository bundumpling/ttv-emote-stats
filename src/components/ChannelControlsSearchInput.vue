<template>
  <div class="search-input-wrapper">
    <label>Search Emotes: </label>
    <input
      name="emoteSearch"
      v-model="emoteSearch"
      class="input"
      type="text"
      aria-label="emote search input"
      autocomplete="off"
      @keydown.space.prevent
    />
  </div>
</template>

<script lang="ts">
import { ChannelState } from "@/types";
import { defineComponent, computed, inject } from "vue";

export default defineComponent({
  name: "ChannelControlsSearchInput",
  setup() {
    const state = inject('state') as ChannelState;
    const emoteSearch = computed({
      get: () => state.emoteSearchInput,
      set(value) {
        state.setEmoteSearchInput(value)
      },
    });

    return {
      emoteSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-input-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline;

  label {
    padding-right: 0.5em;
    white-space: nowrap;
  }
}
</style>