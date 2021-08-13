<template>
  <button class="button" @click="saveAll()">Save All Emotes</button>
  <div class="emote-api-control-wrapper">
    <SettingsEmoteAPIControl
      provider="Twitch"
      :emotes="parseTwitchEmotes()"
      :getProviderEmotes="getProviderEmotes"
      :providerIsAvailable="checkProviderAvailability"
    />
    <SettingsEmoteAPIControl
      provider="FFZ"
      :emotes="parseFFZEmotes()"
      :getProviderEmotes="getProviderEmotes"
      :providerIsAvailable="checkProviderAvailability"
    />
    <SettingsEmoteAPIControl
      provider="BTTV"
      :emotes="parseBTTVEmotes()"
      :getProviderEmotes="getProviderEmotes"
      :providerIsAvailable="checkProviderAvailability"
    />
    <SettingsEmoteAPIControl
      provider="7TV"
      :emotes="parse7TVEmotes()"
      :getProviderEmotes="getProviderEmotes"
      :providerIsAvailable="checkProviderAvailability"
    />
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
    checkProviderAvailability(provider) {
      return this.$store.state.providerAvailability[provider];
    },
    getProviderEmotes(provider) {
      const URLS = {
        Twitch: `http://localhost:8081/twitch/emotes?id=${this.$store.state.channel.twitchID}`,
        FFZ: `http://localhost:8081/ffz/emotes?id=${this.$store.state.channel.twitchID}`,
        BTTV: `http://localhost:8081/bttv/emotes?id=${this.$store.state.channel.twitchID}`,
        "7TV": `http://localhost:8081/7tv/emotes?name=${this.$store.state.channel.name}`,
      };

      fetch(URLS[provider], { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            throw new Error(json.error);
          }
          this.$store.commit("setProviderAPIResults", {
            provider,
            emotes: json,
          });
        })
        .catch((error) => {
          console.error(error);
          this.$store.commit("setProviderAvailability", {
            provider,
            isAvailable: false,
          });
        });
    },
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
  margin: 1em auto;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
</style>