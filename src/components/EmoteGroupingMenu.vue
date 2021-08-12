<template>
  <div class="button-group">
    <button
      class="button"
      :class="showAll ? 'active' : 'inactive'"
      @click="setShowAll(true)"
    >
      All
    </button>
    <button
      class="button"
      :class="showAll ? 'inactive' : 'active'"
      @click="setShowAll(false)"
    >
      Categorical
    </button>
  </div>
  <div class="emotes-per-page">
    <label>Emotes per page: </label>
    <div class="select is-small">
      <select @change="switchSelect($event)">
        <option :value="10" :selected="isSelected(10)">10</option>
        <option :value="25" :selected="isSelected(25)">25</option>
        <option :value="50" :selected="isSelected(50)">50</option>
        <option
          :value="Number.MAX_SAFE_INTEGER"
          :selected="isSelected(Number.MAX_SAFE_INTEGER)"
        >
          ALL
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmoteGroupingMenu",
  computed: {
    showAll() {
      return this.$store.state.emoteGroupingMenuShowAll;
    },
  },
  methods: {
    setShowAll(showAll) {
      this.$store.commit("setEmoteGroupingMenuShowAll", showAll);
    },
    isSelected(value) {
      return this.$store.state.emotesPerPage === value;
    },
    switchSelect(event) {
      this.$store.commit("setEmotesPerPage", event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.emotes-per-page {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-bottom: 2em;

  label {
    padding-right: 0.5em;
  }
}
.active {
  font-weight: bold;
}

.button-group {
  margin-bottom: 2em;
  text-align: center;
}
</style>