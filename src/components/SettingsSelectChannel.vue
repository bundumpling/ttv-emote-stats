<template>
  <div class="settings-select-channel-wrapper">
    <div class="channel">
      Emotes for <span class="channel-name">{{ getName }}</span>
      <span class="channel-twitchid">[TwitchID: {{ getID }}]</span>
      <font-awesome-icon class="icon" icon="edit" @click="openModal()" />
    </div>
  </div>
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

<style scoped>
.settings-select-channel-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.channel {
  font-size: 1.5em;
  font-family: monospace;
}

.channel-name {
  color: #111;
  font-weight: bold;
}

.channel-twitchid {
  color: #555;
  font-variant: small-caps;
  font-size: 0.8em;
  padding: 0 0.5em;
}

.icon {
  color: darkblue;
  margin-right: 0.15em;
  cursor: pointer;
}
</style>