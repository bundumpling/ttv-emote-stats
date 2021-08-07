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
import { store } from "../store.js";
export default {
  name: "EmoteGroupingMenu",
  data() {
    return {
      sharedState: store.state,
    };
  },
  computed: {
    showAll() {
      return store.state.emoteGroupingMenuShowAll;
    },
  },
  methods: {
    setShowAll(showAll) {
      store.setEmoteGroupingMenuShowAll(showAll);
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