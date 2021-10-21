<template>
  <figure class="w-full" role="img" aria-labelledby="TTV EMOTE STATS LOGO">
    <router-link to="/"
      ><img
        src="/img/logo.png"
        class="pt-1 mb-8 w-full"
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
