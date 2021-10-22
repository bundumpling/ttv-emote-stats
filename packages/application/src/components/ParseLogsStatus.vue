<template>
  <div class="text-center">
    <span
      class="text-xl font-bold small-caps break-words"
      :class="isError ? 'text-red-600' : 'text-green-600'"
      >{{ message }}</span
    >
    <p
      v-if="isDone"
      class="mt-4 text-lg text-blue-700 small-caps cursor-pointer"
      @click="reset"
    >
      [ Reset Form ]
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { ParserStatus } from "../types";

export default defineComponent({
  name: "ParseLogsStatus",
  props: {
    status: {
      type: String as PropType<ParserStatus>,
      required: true,
    },
    statusMsg: {
      type: String,
      default: null,
    },
    reset: {
      type: Function as PropType<{ (payload: MouseEvent): void }>,
      required: true,
    },
  },
  setup(props) {
    const message = computed(() => {
      switch (props.status) {
        case ParserStatus.LOADING:
          return "Loading Files";
        case ParserStatus.PARSING:
          return "Parsing Logs";
        case ParserStatus.SAVING:
          return "Saving Results";
        case ParserStatus.ERROR:
          return `Error: ${props.statusMsg ?? "Unknown Error"}`;
        case ParserStatus.DONE:
          return "Results Saved";
        default:
          return "Ready";
      }
    });

    const isDone = computed(
      () =>
        props.status === ParserStatus.DONE ||
        props.status === ParserStatus.IDLE ||
        props.status === ParserStatus.ERROR
    );

    const isError = computed(() => props.status === ParserStatus.ERROR);

    return {
      message,
      isDone,
      isError,
    };
  },
});
</script>
