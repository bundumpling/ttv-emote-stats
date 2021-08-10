<template>
  <TheHeader />
  <Subheader msg="Settings" />
  <div class="container">
    <SettingsSelectChannel
      :channelName="channelName"
      :channelTwitchID="channelTwitchID"
    />
    <EmoteListOptionsPanel />
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import Subheader from "../components/Subheader.vue";
import SettingsSelectChannel from "../components/SettingsSelectChannel.vue";
import EmoteListOptionsPanel from "../components/EmoteListOptionsPanel.vue";
import { store } from "../store";

export default {
  name: "SettingsPage",
  data() {
    return {
      channelName: store.state.channel.name,
      channelTwitchID: store.state.channel.twitchID,
    };
  },
  components: {
    TheHeader,
    Subheader,
    SettingsSelectChannel,
    EmoteListOptionsPanel,
  },
};
</script>

<style>
</style>