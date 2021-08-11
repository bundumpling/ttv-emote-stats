<template>
  <span class="channel-name"
    ><font-awesome-icon
      class="icon"
      icon="edit"
      @click="toggleModalIsActive()"
    />Channel: {{ getName }} (TwitchID: {{ getID }})</span
  >
  <SettingsSelectChannelModal
    :isActive="modalIsActive"
    :closeModal="toggleModalIsActive"
  />
</template>

<script>
import SettingsSelectChannelModal from "./SettingsSelectChannelModal.vue";
import { store } from "../store";
export default {
  name: "SettingsSelectChannel",
  data() {
    return {
      modalIsActive: false,
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
    toggleModalIsActive() {
      this.modalIsActive = !this.modalIsActive;
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