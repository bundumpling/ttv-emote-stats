<template>
  <router-link :to="$props.linkPath">
    <div
      class="
        w-64
        h-56
        m-4
        border-8 border-dark-300
        rounded-lg
        filter
        grayscale-[0.6]
        text-gray-50
        bg-clip-content bg-origin-border
        hover:filter-none hover:text-orange-500 hover:cursor-pointer
      "
      :style="`background-image: url('/img/ManageMenuTile/${$props.backgroundPath}')`"
    >
      <div class="h-full relative flex justify-center items-center text-center">
        <span
          class="
            py-1
            flex-grow
            bg-dark-500 bg-opacity-80
            text-3xl
            font-bold
            small-caps
          "
          >{{ $props.text }}</span
        >
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ManageMenuTile",
  components: {},
  props: {
    text: {
      type: String,
      required: true,
    },
    backgroundPath: {
      type: String,
      required: true,
    },
    linkPath: {
      type: String,
      required: true,
    },
  },
});
</script>
