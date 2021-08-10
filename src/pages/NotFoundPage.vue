<template>
  <TheHeader />
  <h1>404</h1>
  <ASCIIArtCryingBun />
</template>

<script>
export default {
  name: "NotFoundPage",
  components: {},
  // For some reason TheHeader component fails to resolve unless included this way:
  beforeCreate() {
    this.$options.components.TheHeader =
      require("../components/TheHeader.vue").default;
    this.$options.components.ASCIIArtCryingBun =
      require("../components/ASCIIArtCryingBun.vue").default;
  },
};
</script>

<style scoped>
h1 {
  font-size: 4em;
  margin: 0 auto;
  text-align: center;
}
</style>