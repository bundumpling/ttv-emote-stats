<template>
  <div class="block columns">
    <button class="button" @click="randomizeCounts()">Randomize Counts</button>
    <div class="file">
      <label class="file-label">
        <input class="file-input" type="file" multiple="multiple" name="logs" />
        <span class="file-cta">
          <span class="file-icon">
            <font-awesome-icon icon="upload" />
          </span>
          <span class="file-label">Parse Logfile(s)</span>
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import { store } from "../store.js";
export default {
  name: "EmoteListOptionsPanel",
  data() {
    return {
      logParserOpen: false,
    };
  },
  methods: {
    randomizeCounts() {
      store.randomizeCounts();
    },
  },
};
</script>

<style lang="scss">
</style>