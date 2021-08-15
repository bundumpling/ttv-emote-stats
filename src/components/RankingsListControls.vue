<template>
  <div class="list-controls-wrapper">
    <EmoteListSearchInput />
    <EmotesPerPageSelect />
  </div>
</template>

<script>
import EmotesPerPageSelect from "./EmotesPerPageSelect.vue";
import EmoteListSearchInput from "./EmoteListSearchInput.vue";
export default {
  name: "RankingsListControls",
  components: {
    EmotesPerPageSelect,
    EmoteListSearchInput,
  },
};
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