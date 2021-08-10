<template>
  <TheHeader />
  <h2 class="subtitle">Settings</h2>
  <EmoteListOptionsPanel />
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import EmoteListOptionsPanel from "../components/EmoteListOptionsPanel.vue";
export default {
  name: "SettingsPage",
  components: { TheHeader, EmoteListOptionsPanel },
};
</script>

<style>
</style>