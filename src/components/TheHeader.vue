<template>
  <figure class="container" role="img" aria-labelledby="TTV EMOTE STATS LOGO">
    <a href="/"
      ><img
        src="/img/logo.png"
        class="ascii-art-banner"
        alt="ASCII block art logo for TTV Emote Stats"
      />
    </a>
  </figure>
  <nav role="navigation" aria-label="main navigation">
    <v-link href="/Rankings"
      ><span
        ><font-awesome-icon class="icon" icon="chart-bar" />Rankings</span
      ></v-link
    >
    <v-link href="/Settings"
      ><span
        ><font-awesome-icon class="icon" icon="cogs" />Settings</span
      ></v-link
    >
  </nav>
</template>

<script>
import VLink from "./VLink.vue";
export default {
  name: "TheHeader",
  components: {
    VLink,
  },
};
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