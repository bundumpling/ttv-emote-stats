<template>
  <div class="list-controls-wrapper">
    <SearchInput />
    <PerPageSelect />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PerPageSelect from "./RankingsControlsPerPageSelect.vue";
import SearchInput from "./RankingsControlsSearchInput.vue";
export default defineComponent({
  name: "RankingsListControls",
  components: {
    PerPageSelect,
    SearchInput,
  },
});
</script>

<style lang="scss" scoped>
.list-controls-wrapper {
  display: flex;
  justify-content: center;
  align-items: stretch;

  & > div {
    margin: 0 0.5em;
  }
}
</style>