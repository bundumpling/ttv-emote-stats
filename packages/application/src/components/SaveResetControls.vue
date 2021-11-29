<template>
  <div class="flex justify-center text-center">
    <button
      class="
        m-2
        bg-gray-500
        text-light-200
        tracking-wider
        px-4
        py-1
        border-2
        font-bold
        text-lg
        rounded-md
        shadow-md shadow-green-800
      "
      :class="
        !saveDisabled ? 'bg-green-600 border-green-900' : 'cursor-not-allowed'
      "
      :disabled="saveDisabled"
      @click="saveHandler"
    >
      Save
    </button>
    <button
      class="
        m-2
        bg-rose-600
        border-rose-900
        text-light-200
        tracking-wider
        px-4
        py-1
        border-2
        font-bold
        text-lg
        rounded-md
        shadow-md shadow-rose-800
      "
      :disabled="resetDisabled"
      @click="resetHandler"
    >
      Reset
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SaveResetControls",
  props: {
    saveDisabled: {
      type: Boolean,
      default: false,
    },
    resetDisabled: {
      type: Boolean,
      default: false,
    },
    saveHandler: {
      type: Function as PropType<{ (payload: MouseEvent): void }>,
      required: true,
    },
    resetHandler: {
      type: Function as PropType<{ (payload: MouseEvent): void }>,
      required: true,
    },
  },
});
</script>
