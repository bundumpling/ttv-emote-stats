<template>
  <TheSubheader msg="Settings" />
  <div class="container">
    <SelectChannel />
    <OptionsPanel />
    <APIControlContainer />
  </div>
</template>

<script>
import TheSubheader from "../components/TheSubheader.vue";
import SelectChannel from "../components/SettingsSelectChannel.vue";
import OptionsPanel from "../components/SettingsControlPanel.vue";
import APIControlContainer from "../components/SettingsAPIControlContainer.vue";

export default {
  name: "SettingsPage",
  components: {
    TheSubheader,
    SelectChannel,
    OptionsPanel,
    APIControlContainer,
  },
};
</script>

<style>
</style>