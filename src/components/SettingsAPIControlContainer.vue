<template>
  <div class="emote-api-control-wrapper">
    <SettingsAPIControl provider="Twitch" :emotes="parseTwitchEmotes" />
    <SettingsAPIControl provider="FFZ" :emotes="parseFFZEmotes" />
    <SettingsAPIControl provider="BTTV" :emotes="parseBTTVEmotes" />
    <SettingsAPIControl provider="7TV" :emotes="parse7TVEmotes" />
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
} from "../helpers/parseEmotesByProvider";

import SettingsAPIControl from "./SettingsAPIControl.vue";
export default defineComponent({
  name: "SettingsAPIControlContainer",
  components: {
    SettingsAPIControl,
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