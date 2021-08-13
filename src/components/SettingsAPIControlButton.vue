<template>
  <button
    class="button is-outlined"
    :class="!isAvailable ? 'is-danger' : 'is-success'"
    @click="fetchEmotesFromProvider(provider)"
  >
    <font-awesome-icon
      :icon="hasEmotes || !isAvailable ? 'redo' : 'download'"
    /><span class="button-text">{{
      hasEmotes ? "Refresh" : !isAvailable ? "Retry" : "Download"
    }}</span>
  </button>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SettingsAPIControlButton",
  props: {
    provider: String,
  },
  computed: {
    isAvailable() {
      return this.$store.state.providerAvailability[this.provider];
    },
    hasEmotes() {
      return this.$store.state.providerAPIResults[this.provider].length;
    },
  },
  methods: {
    ...mapActions(["fetchEmotesFromProvider"]),
  },
};
</script>

<style lang="scss" scoped>
.button-text {
  padding-left: 0.25em;
  font-variant: small-caps;
}
</style>