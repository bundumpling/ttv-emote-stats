<template>
  <button class="button" @click="saveAll()">Save All Emotes</button>
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
import { MutationType } from "../store/mutations";

import SettingsEmoteAPIControl from "./SettingsEmoteAPIControl.vue";
export default defineComponent({
  name: "SettingsEmoteProviders",
  components: {
    SettingsEmoteAPIControl,
  },
  setup() {
    const store = useStore();

    const parseTwitchEmotes = computed(() => {
      if (!store.state.providerAPIResults["Twitch"].length) return [];
      return store.state.providerAPIResults["Twitch"].map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: emote.images.url_1x,
        };
      });
    });
    const parseFFZEmotes = computed(() => {
      if (!store.state.providerAPIResults["FFZ"].length) return [];
      return store.state.providerAPIResults["FFZ"].map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: emote.urls["1"],
        };
      });
    });
    const parseBTTVEmotes = computed(() => {
      if (!store.state.providerAPIResults["BTTV"].length) return [];
      return store.state.providerAPIResults["BTTV"].map((emote) => {
        return {
          id: emote.id,
          name: emote.code,
          image: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
        };
      });
    });
    const parse7TVEmotes = computed(() => {
      if (!store.state.providerAPIResults["7TV"].length) return [];
      return store.state.providerAPIResults["7TV"].map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: `https://cdn.7tv.app/emote/${emote.id}/1x`,
        };
      });
    });
    function saveAll() {
      const providerToParser = {
        Twitch: this.parseTwitchEmotes,
        FFZ: this.parseFFZEmotes,
        BTTV: this.parseBTTVEmotes,
        "7TV": this.parse7TVEmotes,
      };

      let results = [];

      for (let provider in store.state.providerAPIResults) {
        providerToParser[provider].forEach((emote) => {
          results.push({ ...emote, provider, count: 0 });
        });
      }
      store.commit(MutationType.UpdateEmotes, results);
    }

    return {
      parseTwitchEmotes,
      parseFFZEmotes,
      parseBTTVEmotes,
      parse7TVEmotes,
      saveAll,
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