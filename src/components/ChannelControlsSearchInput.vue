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
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";

export default defineComponent({
  name: "ChannelControlsSearchInput",
  setup() {
    const store = useStore();
    const emoteSearch = computed({
      get: () => store.state.channel.emoteSearchInput,
      set(value) {
        store.commit(MutationType.SetEmoteSearchInput, value);
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