<template>
  <Subheader msg="Settings" />
  <div class="container">
    <SettingsSelectChannel />
    <SettingsOptionsPanel />
    <SettingsEmoteProviders />
  </div>
</template>

<script>
import Subheader from "../components/Subheader.vue";
import SettingsSelectChannel from "../components/SettingsSelectChannel.vue";
import SettingsEmoteProviders from "../components/SettingsEmoteProviders.vue";
import SettingsOptionsPanel from "../components/SettingsOptionsPanel.vue";

export default {
  name: "SettingsPage",
  components: {
    Subheader,
    SettingsSelectChannel,
    SettingsEmoteProviders,
    SettingsOptionsPanel,
  },
};
</script>

<style>
</style>