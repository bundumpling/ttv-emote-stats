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
  },
};
</script>

<style>
.active {
  font-weight: bold;
}

.button-group {
  margin-bottom: 2em;
  text-align: center;
}
</style>