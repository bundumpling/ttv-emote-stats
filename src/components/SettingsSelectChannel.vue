<template>
  <span class="channel-name"
    ><font-awesome-icon
      class="icon"
      icon="edit"
      @click="setChannelNameAndID(inputChannelData)"
    />Channel: {{ getName }} (TwitchID: {{ getID }})</span
  >
</template>

<script>
import { store } from "../store";
export default {
  name: "SettingsSelectChannel",
  data() {
    return {
      inputChannelData: {
        name: "",
        twitchID: "59204658",
      },
    };
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
    setChannelNameAndID(inputChannelData) {
      store.setChannelNameAndID(inputChannelData);
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