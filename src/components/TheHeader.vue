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
  <nav role="navigation" aria-label="main navigation">
    <router-link to="/Rankings"
      ><span
        ><font-awesome-icon class="icon" icon="chart-bar" />Rankings</span
      ></router-link
    >
    <router-link to="/Settings"
      ><span
        ><font-awesome-icon class="icon" icon="cogs" />Settings</span
      ></router-link
    >
  </nav>
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
}

nav {
  margin: 0.5rem auto;
  display: flex;
  justify-content: center;
}

nav a {
  font-family: monospace;
  letter-spacing: 0.05em;
  margin: 0 1em;
  padding: 0.25em;
  line-height: 1.25em;
  font-variant: small-caps;
  font-size: 2em;
}

nav a:hover {
  color: purple;
}

.icon {
  margin-right: 0.15em;
}
</style>