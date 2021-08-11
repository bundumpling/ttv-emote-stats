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