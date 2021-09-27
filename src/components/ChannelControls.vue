<template>
  <div class="list-controls-wrapper">
    <SearchInput />
    <PerPageSelect />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PerPageSelect from "./ChannelControlsPerPageSelect.vue";
import SearchInput from "./ChannelControlsSearchInput.vue";
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
  align-items: stretch;

  & > div {
    margin: 0 0.5em;
  }
}
</style>