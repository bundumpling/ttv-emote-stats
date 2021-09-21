<template>
  <div class="search-input-wrapper">
    <label>Search: </label>
    <input
      name="search"
      v-model="search"
      class="input"
      type="text"
      aria-label="search input"
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
    const search = computed({
      get: () => store.state.channel.searchInput,
      set(value) {
        store.commit(MutationType.SetEmoteSearchInput, value);
      },
    });

    return {
      search,
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
  }
}
</style>