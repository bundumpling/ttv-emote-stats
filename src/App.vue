<template>
  <div id="app" class="container">
    <h1 class="title full-width">Emote Stats</h1>
    <EmoteListWrapper />
  </div>
</template>

<script>
import EmoteListWrapper from "./components/EmoteListWrapper.vue";

export default {
  name: "App",
  components: {
    EmoteListWrapper,
  },
};
</script>

<style>
h1 {
  text-align: center;
}
</style>
