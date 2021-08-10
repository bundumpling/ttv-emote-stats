<template>
  <span class="channel-name"
    >Channel: {{ channelName }} (TwitchID: {{ channelTwitchID }})</span
  >
</template>

<script>
export default {
  name: "SettingsSelectChannel",
  props: {
    channelName: String,
    channelTwitchID: Number,
  },
};
</script>

<style>
.channel-name {
  font-size: 1.5em;
  font-family: monospace;
}
</style>