<template>
  <TheHeader />
</template>

<script>
export default {
  name: "HomePage",
  components: {},
  // For some reason TheHeader component fails to resolve unless included this way:
  beforeCreate() {
    this.$options.components.TheHeader =
      require("../components/TheHeader.vue").default;
  },
};
</script>

<style>
</style>