<template>
  <button class="button" @click="saveAll()">Save All Emotes</button>
  <div class="emote-api-control-wrapper">
    <SettingsEmoteAPIControl provider="Twitch" :emotes="parseTwitchEmotes()" />
    <SettingsEmoteAPIControl provider="FFZ" :emotes="parseFFZEmotes()" />
    <SettingsEmoteAPIControl provider="BTTV" :emotes="parseBTTVEmotes()" />
    <SettingsEmoteAPIControl provider="7TV" :emotes="parse7TVEmotes()" />
  </div>
</template>

<script>
import SettingsEmoteAPIControl from "./SettingsEmoteAPIControl.vue";
export default {
  name: "SettingsEmoteProviders",
  components: {
    SettingsEmoteAPIControl,
  },
  methods: {
    parseTwitchEmotes() {
      if (!this.$store.state.providerAPIResults["Twitch"].length) return [];
      return this.$store.state.providerAPIResults["Twitch"].map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: emote.images.url_1x,
        };
      });
    },
    parseFFZEmotes() {
      if (!this.$store.state.providerAPIResults["FFZ"].length) return [];
      return this.$store.state.providerAPIResults["FFZ"].map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: emote.urls["1"],
        };
      });
    },
    parseBTTVEmotes() {
      if (!this.$store.state.providerAPIResults["BTTV"].length) return [];
      return this.$store.state.providerAPIResults["BTTV"].map((emote) => {
        return {
          id: emote.id,
          name: emote.code,
          image: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
        };
      });
    },
    parse7TVEmotes() {
      if (!this.$store.state.providerAPIResults["7TV"].length) return [];
      return this.$store.state.providerAPIResults["7TV"].map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: `https://cdn.7tv.app/emote/${emote.id}/1x`,
        };
      });
    },
    saveAll() {
      const providerToParser = {
        Twitch: this.parseTwitchEmotes,
        FFZ: this.parseFFZEmotes,
        BTTV: this.parseBTTVEmotes,
        "7TV": this.parse7TVEmotes,
      };

      let results = [];

      for (let provider in this.$store.state.providerAPIResults) {
        providerToParser[provider].call().forEach((emote) => {
          results.push({ ...emote, type: provider, count: 0 });
        });
      }
      this.$store.commit("updateEmotes", results);
    },
  },
};
</script>

<style>
.emote-api-control-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>