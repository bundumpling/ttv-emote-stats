<template>
  <div>
    <span class="status">{{ message }}</span>
    <p v-if="isDone" @click="reset">[ Reset Form ]</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { ParserStatus } from "../types";

export default defineComponent({
  name: "ManageParseLogStatus",
  props: {
    status: {
      type: String as PropType<ParserStatus>,
      required: true,
    },
    reset: {
      type: Function,
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
        case ParserStatus.DONE:
          return "Results Saved";
        default:
          return "";
      }
    });

    const isDone = computed(() => props.status === ParserStatus.DONE);

    return {
      message,
      isDone,
    };
  },
});
</script>

<style lang="scss" scoped>
p,
span {
  text-align: center;
}
.status {
  font-size: 2em;
  font-variant: small-caps;
  font-weight: bold;
  color: green;
}
p {
  margin-top: 1em;
  color: blue;
  font-size: 1.2em;
  font-variant: small-caps;
  cursor: pointer;
}
</style>