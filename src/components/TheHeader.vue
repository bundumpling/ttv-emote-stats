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
    <a href="/Rankings"
      ><span
        ><font-awesome-icon class="icon" icon="chart-bar" />Rankings</span
      ></a
    >
    <a href="/Settings"
      ><span><font-awesome-icon class="icon" icon="cogs" />Settings</span></a
    >
  </nav>
</template>

<script>
export default {
  name: "TheHeader",
};
</script>
  
<style scoped>
.ascii-art-banner {
  padding-top: 0.75em;
}

nav {
  margin: 1.5rem auto;
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