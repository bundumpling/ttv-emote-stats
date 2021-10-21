<template>
  <h2
    class="py-4 font-inconsolata text-4xl font-medium tracking-wide text-center"
  >
    {{ msg }}
  </h2>
</template>

<script lang="ts">
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
