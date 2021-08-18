<template>
  <div class="emote-api-control">
    <div class="emote-api-control-header">
      <div class="emote-api-control-header-provider">{{ provider }}</div>
      <SettingsAPIControlButton
        :provider="provider"
        :buttonStatus="buttonStatus"
      />
    </div>
    <div class="emote-api-control-body">
      <div
        class="emote-api-control-unavailable has-text-danger"
        v-if="!isAvailable"
      >
        No Emotes Available
      </div>
      <div class="emote-api-control-emotelist-wrapper" v-if="emotes.length">
        <div v-for="emote in emotes" v-bind:key="emote.id">
          <img :src="emote.image" :alt="emote.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import SettingsAPIControlButton from "./SettingsAPIControlButton.vue";
export default defineComponent({
  name: "SettingsEmoteApiControl",
  props: {
    provider: String,
    emotes: Array,
  },
  components: {
    SettingsAPIControlButton,
  },
  setup(props) {
    const store = useStore();
    const isAvailable = computed(
      () => store.state.providerAvailability[props.provider]
    );
    const buttonStatus = computed(
      () => store.state.emoteFetchButtons[props.provider].status
    );

    return {
      isAvailable,
      buttonStatus,
    };
  },
});
</script>

<style>
.emote-api-control {
  margin: 0 1em;
  max-width: 260px;
}

.emote-api-control-header {
  display: flex;
  justify-content: space-between;
  align-content: center;
  border-bottom: 4px solid #333;
  padding-bottom: 0.25em;
}

.emote-api-control-header-provider {
  font-size: 1.75em;
  font-weight: bold;
  padding-right: 0.5em;
}

.emote-api-control-emotelist-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: flex-start;
  padding-top: 0.25em;
}

.emote-api-control-unavailable {
  font-size: 1.5em;
  text-align: center;
  font-variant: small-caps;
}
</style>