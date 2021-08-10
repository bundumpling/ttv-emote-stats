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
  font-size: 3.5em;
  font-weight: bold;
  text-align: center;
}
</style>