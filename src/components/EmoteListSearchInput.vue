<template>
  <div class="search-input-wrapper">
    <label>Search: </label>
    <input
      id="search-input"
      class="input"
      type="text"
      aria-label="search input"
      v-model.trim="search"
    />
  </div>
</template>

<script>
export default {
  name: "EmoteListSearchInput",
  data() {
    return {
      search: "",
    };
  },
  watch: {
    search(value) {
      this.$store.commit("setSearchInput", value);
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