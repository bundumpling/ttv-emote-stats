<template>
  <div class="button-group">
    <button class="button" @click="randomizeCounts()">Randomize Counts</button>
    <button class="button" @click="zeroCounts()">Zero Counts</button>
    <div class="file is-centered">
      <label class="file-label">
        <input
          id="input"
          class="file-input"
          name="logs"
          type="file"
          multiple
          @change="logFileNames()"
        />
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

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";

export default defineComponent({
  name: "EmoteListOptionsPanel",
  setup() {
    const store = useStore();

    const randomizeCounts = () => {
      store.commit(MutationType.RandomizeCounts, undefined);
    };

    const zeroCounts = () => {
      store.commit(MutationType.ZeroCounts, undefined);
    };

    function logFileNames() {
      let fileInput = document.getElementById("input") as HTMLInputElement;
      if (fileInput.files) {
        let files: FileList = fileInput.files;
        for (let i = 0; i < files.length; i++) {
          let reader = new FileReader();
          reader.onerror = (e) => {
            if (e.target && e.target.error) {
              console.log(e.target.error.name);
            }
          };
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              let text = e.target.result;
              store.commit(MutationType.ParseLog, text);
            }
          };
          reader.readAsText(files[i]);
        }
      }
    }
    // In order for the change event to fire, a different file must be uploaded.
    // By setting the input element's value to zero, the same log file can be processed multiple times.
    // document.getElementById("input").value = "";
    return {
      randomizeCounts,
      zeroCounts,
      logFileNames,
    };
  },
});
</script>

<style lang="scss">
</style>