<template>
  <Subheader msg="404" />
  <ASCIIArtCryingBun />
</template>

<script>
import Subheader from "../components/TheSubheader.vue";
import ASCIIArtCryingBun from "../components/ASCIIArtCryingBun.vue";
export default {
  name: "NotFoundPage",
  components: { Subheader, ASCIIArtCryingBun },
  // For some reason TheHeader component fails to resolve unless included this way:
  // beforeCreate() {
  //   this.$options.components.TheHeader =
  //     require("../components/TheHeader.vue").default;
  //   this.$options.components.ASCIIArtCryingBun =
  //     require("../components/ASCIIArtCryingBun.vue").default;
  // },
};
</script>

<style scoped>
h1 {
  font-size: 4em;
  margin: 0 auto;
  text-align: center;
}
</style>