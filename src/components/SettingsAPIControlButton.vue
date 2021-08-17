<template>
  <button
    class="button is-outlined"
    :class="classStylingFromStatus"
    @click="fetchEmotesFromProvider(provider)"
  >
    <font-awesome-icon
      :icon="hasEmotes || !isAvailable ? 'redo' : 'download'"
    /><span class="button-text">{{
      hasEmotes ? "Refresh" : !isAvailable ? "Retry" : "Download"
    }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import { mapActions } from "vuex";

export default defineComponent({
  name: "SettingsAPIControlButton",
  props: {
    provider: String,
    buttonStatus: String,
  },
  setup(props) {
    const store = useStore();
    const isAvailable = computed(() => {
      return store.state.providerAvailability[props.provider];
    });
    const hasEmotes = computed(() => {
      return store.state.providerAPIResults[props.provider].length;
    });

    const classStylingFromStatus = computed(() => {
      let buttonStatus = "";
      switch (props.buttonStatus) {
        case "Loading":
          buttonStatus = "is-warning is-loading";
          break;
        case "Success":
          buttonStatus = "is-success";
          break;
        case "Error":
          buttonStatus = "is-danger";
          break;
        default:
          buttonStatus = "is-success";
      }
      return buttonStatus;
    });

    return {
      isAvailable,
      hasEmotes,
      classStylingFromStatus,
      ...mapActions(["fetchEmotesFromProvider"]),
    };
  },
});
</script>

<style lang="scss" scoped>
.button-text {
  padding-left: 0.25em;
  font-variant: small-caps;
}
</style>