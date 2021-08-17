<template>
  <div class="list-controls-wrapper">
    <EmoteListSearchInput />
    <EmotesPerPageSelect />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EmotesPerPageSelect from "./EmotesPerPageSelect.vue";
import EmoteListSearchInput from "./EmoteListSearchInput.vue";
export default defineComponent({
  name: "RankingsListControls",
  components: {
    EmotesPerPageSelect,
    EmoteListSearchInput,
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