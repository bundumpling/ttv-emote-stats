<template>
  <h2>{{ msg }}</h2>
</template>

<script>
export default {
  name: "Subheader",
  props: {
    msg: String,
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 0.5em;
  font-size: 4em;
  text-align: center;
}
</style>