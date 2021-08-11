<template>
  <span class="channel-name"
    ><font-awesome-icon class="icon" icon="edit" @click="openModal()" />Channel:
    {{ getName }} (TwitchID: {{ getID }})</span
  >
  <SettingsSelectChannelModal v-if="modalIsActive" :closeModal="closeModal" />
  <div class="box columns emote-api-control-wrapper">
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
import SettingsSelectChannelModal from "./SettingsSelectChannelModal.vue";
import SettingsEmoteAPIControl from "./SettingsEmoteAPIControl.vue";
import { store } from "../store";
export default {
  name: "SettingsSelectChannel",
  data() {
    return {
      modalIsActive: false,
      emotes: {
        Twitch: [],
        FFZ: [],
        BTTV: [],
        "7TV": [],
      },
    };
  },
  components: {
    SettingsSelectChannelModal,
    SettingsEmoteAPIControl,
  },
  computed: {
    getName() {
      return store.state.channel.name;
    },
    getID() {
      return store.state.channel.twitchID;
    },
  },
  methods: {
    openModal() {
      this.modalIsActive = true;
      this.$nextTick(function () {
        document.getElementById("settings-select-channel-input").focus();
      });
    },
    closeModal() {
      this.modalIsActive = false;
    },
    getTwitchEmotes() {
      let URL = `http://localhost:8081/twitch/emotes?id=${this.getID}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.emotes.Twitch = json;
        });
    },
    getFFZEmotes() {
      let URL = `http://localhost:8081/ffz/emotes?id=${this.getID}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.emotes.FFZ = json;
        });
    },
    getBTTVEmotes() {
      let URL = `http://localhost:8081/bttv/emotes?id=${this.getID}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.emotes.BTTV = json;
        });
    },
    get7TVEmotes() {
      let URL = `http://localhost:8081/7tv/emotes?name=${this.getName}`;
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
  },
};
</script>

<style>
.channel-name {
  font-size: 1.5em;
  font-family: monospace;
}

.icon {
  color: darkblue;
  margin-right: 0.15em;
}
</style>