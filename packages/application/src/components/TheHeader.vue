<template>
  <figure class="container" role="img" aria-labelledby="TTV EMOTE STATS LOGO">
    <router-link to="/"
      ><img
        src="/img/logo.png"
        class="ascii-art-banner"
        alt="ASCII block art logo for TTV Emote Stats"
      />
    </router-link>
  </figure>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TheHeader",
});
</script>

<style scoped>
.ascii-art-banner {
  padding-top: 0.75em;
  margin-bottom: 2em;
}
</style>
