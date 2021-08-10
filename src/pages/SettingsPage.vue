<template>
  <TheHeader />
  <Subheader msg="Settings" />
  <div class="container">
    <SettingsSelectChannel :name="channel.name" :twitchID="channel.twitchID" />
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
    const { channel } = store.state;
    return {
      channel: {
        name: channel.name,
        twitchID: channel.twitchID,
      },
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