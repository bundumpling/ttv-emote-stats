<template>
  <div id="app">
    <h1 class="title">Emote Stats</h1>
    <EmoteList />
  </div>
</template>

<script>
import EmoteList from "./components/EmoteList.vue";

export default {
  name: "App",
  components: {
    EmoteList,
  },
};
</script>

<style>
h1 {
  text-align: center;
}
</style>
