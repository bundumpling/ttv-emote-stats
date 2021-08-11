<template>
  <span class="channel-name"
    ><font-awesome-icon class="icon" icon="edit" @click="openModal()" />Channel:
    {{ getName }} (TwitchID: {{ getID }})</span
  >
  <SettingsSelectChannelModal v-if="modalIsActive" :closeModal="closeModal" />
  <div class="box columns emote-api-control-wrapper">
    <div class="column emote-api-control">
      <div class="emote-api-control-header">
        <span>TwitchTV</span>
      </div>
      <div class="emote-api-control-body">
        <button class="button" @click="getTwitchEmotes()">
          <font-awesome-icon icon="download" />Emotes
        </button>
        <div
          class="emote-api-control-emotelist-wrapper"
          v-if="twitchEmotes.length"
        >
          <ul>
            <li v-for="emote in twitchEmotes" v-bind:key="emote.id">
              <img :src="emote.images.url_1x" :alt="emote.name" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsSelectChannelModal from "./SettingsSelectChannelModal.vue";
import { store } from "../store";
export default {
  name: "SettingsSelectChannel",
  data() {
    return {
      modalIsActive: false,
      twitchEmotes: [],
    };
  },
  components: {
    SettingsSelectChannelModal,
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
      let URL = `http://localhost:8081/twitch/chat/emotes?id=${this.getID}`;
      fetch(URL, { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          this.twitchEmotes = json;
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