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
    />
  </div>
</template>

<script>
export default {
  name: "EmoteListSearchInput",
  computed: {
    search: {
      set(value) {
        this.$store.commit("setSearchInput", value);
      },
      get() {
        return this.$store.state.rankings.searchInput;
      },
    },
  },
};
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