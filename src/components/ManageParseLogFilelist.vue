<template>
  <div class="filelist">
    <h3>{{ header }}</h3>
    <ul>
      <li v-for="(filename, i) in list" :key="`${filename}-${i}`">
        {{ filename }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ManageParseLogFilelist",
  props: {
    header: {
      type: String,
      required: true,
    },
    list: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.filelist {
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  & > h3 {
    border-bottom: 1px solid black;
    text-align: center;
    font-size: 1.3em;
    font-weight: bold;
  }
  & > ul {
    flex: 1;
    overflow-y: auto;
    background-color: #eee;
    font-size: 0.9em;
    font-family: monospace;
  }
}

li {
  text-align: center;
  padding: 2px;
}
</style>