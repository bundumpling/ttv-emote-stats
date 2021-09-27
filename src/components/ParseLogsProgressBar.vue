<template>
  <progress class="progress" :value="progress" max="100" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ParseLogsProgressBar",
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
});
</script>