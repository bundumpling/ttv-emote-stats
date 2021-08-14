<template>
  <li :class="isActive ? 'is-active' : ''">
    <a>{{ tabName }} </a>
  </li>
</template>

<script>
export default {
  name: "RankingsTab",
  props: {
    tabName: String,
  },
  computed: {
    isActive() {
      return this.$store.state.rankings.activeTab === this.tabName;
    },
  },
};
</script>