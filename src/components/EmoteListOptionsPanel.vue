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

<script>
export default {
  name: "EmoteListOptionsPanel",
  methods: {
    randomizeCounts() {
      this.$store.commit("randomizeCounts");
    },
    zeroCounts() {
      this.$store.commit("zeroCounts");
    },
    logFileNames() {
      let files = document.getElementById("input").files;
      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.onerror = (e) => console.log(e.target.error.name);
        reader.onload = (e) => {
          let text = e.target.result;
          this.$store.commit("parseLog", text);
        };
        reader.readAsText(files[i]);
      }

      // In order for the change event to fire, a different file must be uploaded.
      // By setting the input element's value to zero, the same log file can be processed multiple times.
      // document.getElementById("input").value = "";
    },
  },
};
</script>

<style lang="scss">
</style>