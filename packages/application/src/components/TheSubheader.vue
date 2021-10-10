<template>
  <h2>{{ msg }}</h2>
</template>

<script>
export default {
  name: "TheSubheader",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@500&display=swap");
h2 {
  font-family: "Inconsolata", monospace;
  padding-bottom: 0.75em;
  font-size: 2.2em;
  font-weight: 500;
  text-align: center;
}
</style>
