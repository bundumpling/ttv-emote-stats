<template>
  <TheHeader />
  <Subheader msg="Settings" />
  <div class="container">
    <SettingsSelectChannel :name="name" :twitchID="twitchID" />
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
    const { name, twitchID } = store.state.channel;
    return {
      name: name,
      twitchID: twitchID,
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