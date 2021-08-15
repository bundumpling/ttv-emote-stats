<template>
  <li :class="isActive ? 'is-active' : ''">
    <a @click="setActiveTab()">{{ tabName }} </a>
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
  methods: {
    setActiveTab() {
      this.$store.commit("setActiveTab", this.tabName);
    },
  },
};
</script>