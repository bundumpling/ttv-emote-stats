<template>
  <span class="channel-name"
    ><font-awesome-icon class="icon" icon="edit" />Channel:
    {{ name }} (TwitchID: {{ twitchID }})</span
  >
</template>

<script>
export default {
  name: "SettingsSelectChannel",
  props: {
    name: String,
    twitchID: Number,
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