<template>
  <button class="button" @click="saveAll()">Save All Emotes</button>
  <div class="emote-api-control-wrapper">
    <SettingsEmoteAPIControl
      name="Twitch"
      :emotes="parseTwitchEmotes()"
      :getEmotes="getTwitchEmotes"
    />
    <SettingsEmoteAPIControl
      name="FFZ"
      :emotes="parseFFZEmotes()"
      :getEmotes="getFFZEmotes"
    />
    <SettingsEmoteAPIControl
      name="BTTV"
      :emotes="parseBTTVEmotes()"
      :getEmotes="getBTTVEmotes"
    />
    <SettingsEmoteAPIControl
      name="7TV"
      :emotes="parse7TVEmotes()"
      :getEmotes="get7TVEmotes"
    />
  </div>
</template>

<script>
import SettingsEmoteAPIControl from "./SettingsEmoteAPIControl.vue";
export default {
  name: "SettingsEmoteProviders",
  data() {
    return {
      emotes: {
        Twitch: [],
        FFZ: [],
        BTTV: [],
        "7TV": [],
      },
    };
  },
  components: {
    SettingsEmoteAPIControl,
  },
  methods: {
    getTwitchEmotes() {
      let URL = `http://localhost:8081/twitch/emotes?id=${this.$store.state.channel.twitchID}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.emotes.Twitch = json;
        });
    },
    getFFZEmotes() {
      let URL = `http://localhost:8081/ffz/emotes?id=${this.$store.state.channel.twitchID}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.emotes.FFZ = json;
        });
    },
    getBTTVEmotes() {
      let URL = `http://localhost:8081/bttv/emotes?id=${this.$store.state.channel.twitchID}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.emotes.BTTV = json;
        });
    },
    get7TVEmotes() {
      let URL = `http://localhost:8081/7tv/emotes?name=${this.$store.state.channel.name}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.emotes["7TV"] = json;
        });
    },
    parseTwitchEmotes() {
      return this.emotes.Twitch.map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: emote.images.url_1x,
        };
      });
    },
    parseFFZEmotes() {
      return this.emotes.FFZ.map((emote) => {
        return {
          id: emote.id,
          name: emote.name,
          image: emote.urls["1"],
        };
      });
    },
    parseBTTVEmotes() {
      return this.emotes.BTTV.map((emote) => {
        return {
          id: emote.id,
          name: emote.code,
          image: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
        };
      });
    },
    parse7TVEmotes() {
      return this.emotes["7TV"].map((emote) => {
        return {
          id: emote.id,
          name: emote.code,
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

      for (let provider in this.emotes) {
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