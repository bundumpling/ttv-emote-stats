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
    <a href="/Rankings"><span>Rankings</span></a>
    <a href="/Settings"><span>Settings</span></a>
  </nav>
</template>

<script>
export default {
  name: "TheHeader",
};
</script>
  
<style>
nav {
  margin: 1.2rem auto;
  display: flex;
  justify-content: center;
}

nav a {
  margin: 0 1em;
  font-variant: small-caps;
  font-size: 1.4em;
}

nav a:hover {
  text-decoration: underline;
  color: purple;
}
</style>