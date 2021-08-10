<template>
  <TheHeader />
  <Subheader msg="Settings" />
  <EmoteListOptionsPanel />
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import Subheader from "../components/Subheader.vue";
import EmoteListOptionsPanel from "../components/EmoteListOptionsPanel.vue";
export default {
  name: "SettingsPage",
  components: { TheHeader, Subheader, EmoteListOptionsPanel },
};
</script>

<style>
</style>