<template>
  <div class="max-w-full">
    <TheHeader />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheHeader from "./components/TheHeader.vue";

export default defineComponent({
  name: "App",
  components: {
    TheHeader,
  },
});
</script>

<style lang="scss">
@import "./assets/sass/main.scss";
html {
  overflow-y: auto;
}
</style>
