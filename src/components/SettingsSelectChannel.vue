<template>
  <span class="channel-name"
    ><font-awesome-icon class="icon" icon="edit" @click="openModal()" />Channel:
    {{ getName }} (TwitchID: {{ getID }})</span
  >
  <SettingsSelectChannelModal v-if="modalIsActive" :closeModal="closeModal" />
</template>

<script>
import SettingsSelectChannelModal from "./SettingsSelectChannelModal.vue";

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
      return this.$store.state.channel.name;
    },
    getID() {
      return this.$store.state.channel.twitchID;
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