<template>
  <TheHeader />
  <Subheader msg="Settings" />
  <div class="container">
    <SettingsSelectChannel />
    <SettingsEmoteProviders />
    <EmoteListOptionsPanel />
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import Subheader from "../components/Subheader.vue";
import SettingsSelectChannel from "../components/SettingsSelectChannel.vue";
import SettingsEmoteProviders from "../components/SettingsEmoteProviders.vue";
import EmoteListOptionsPanel from "../components/EmoteListOptionsPanel.vue";

export default {
  name: "SettingsPage",
  components: {
    TheHeader,
    Subheader,
    SettingsSelectChannel,
    SettingsEmoteProviders,
    EmoteListOptionsPanel,
  },
};
</script>

<style>
</style>