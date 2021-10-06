<template>
  <div class="list-controls-wrapper">
    <div class="search-input-wrapper">
      <SearchInput injected-name="emoteSearch" label="Search Emotes" />
    </div>
    <PerPageSelect />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PerPageSelect from "./ChannelControlsPerPageSelect.vue";
import SearchInput from "./SearchInput.vue";
export default defineComponent({
  name: "ChannelListControls",
  components: {
    PerPageSelect,
    SearchInput,
  }
});
</script>

<style lang="scss" scoped>
.list-controls-wrapper {
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
  align-items: baseline;

  & > div {
    margin: 0 0.5em;
  }
}

.search-input-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline;
}
</style>