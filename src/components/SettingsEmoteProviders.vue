<template>
  <div class="emote-api-control-wrapper">
    <SettingsEmoteAPIControl provider="Twitch" :emotes="parseTwitchEmotes" />
    <SettingsEmoteAPIControl provider="FFZ" :emotes="parseFFZEmotes" />
    <SettingsEmoteAPIControl provider="BTTV" :emotes="parseBTTVEmotes" />
    <SettingsEmoteAPIControl provider="7TV" :emotes="parse7TVEmotes" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import {
  fromTwitch,
  fromFFZ,
  fromBTTV,
  from7TV,
} from "../utils/parseEmotesByProvider";

import SettingsEmoteAPIControl from "./SettingsEmoteAPIControl.vue";
export default defineComponent({
  name: "SettingsEmoteProviders",
  components: {
    SettingsEmoteAPIControl,
  },
  setup() {
    const store = useStore();

    const parseTwitchEmotes = computed(() => fromTwitch(store.state));
    const parseFFZEmotes = computed(() => fromFFZ(store.state));
    const parseBTTVEmotes = computed(() => fromBTTV(store.state));
    const parse7TVEmotes = computed(() => from7TV(store.state));

    return {
      parseTwitchEmotes,
      parseFFZEmotes,
      parseBTTVEmotes,
      parse7TVEmotes,
    };
  },
});
</script>

<style>
.emote-api-control-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>