<template>
  <div class="search-input-wrapper">
    <label>Search Emotes: </label>
    <input
      v-model="emoteSearch"
      name="emoteSearch"
      class="input"
      type="text"
      aria-label="emote search input"
      autocomplete="off"
      @input="validateInput"
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

    const invalidInputRegExp = new RegExp(/[^a-z0-9]/, 'gi');

    const emoteSearch = computed({
      get: () => state.emoteSearchInput,
      set(value) {
        state.setEmoteSearchInput(value.replace(invalidInputRegExp, ''))
      },
    });

    function validateInput(event: InputEvent) {      
      if (invalidInputRegExp.test(event.target.value)) {
        let resetEvent = document.createEvent('Event');
        resetEvent.initEvent('emoteSearch', true, true);
        event.target.value = emoteSearch.value;
        event.target.dispatchEvent(resetEvent);
      }
    }

    return {
      emoteSearch,
      validateInput
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