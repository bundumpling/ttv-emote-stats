<template>
  <span class="channel-name"
    ><font-awesome-icon
      class="icon"
      icon="edit"
      @click="setChannelNameAndID(inputChannelData)"
    />Channel: {{ name }} (TwitchID: {{ twitchID }})</span
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
        twitchID: "",
      },
    };
  },
  props: {
    name: String,
    twitchID: String,
  },
  methods: {
    setChannelNameAndID: store.setChannelNameAndID,
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