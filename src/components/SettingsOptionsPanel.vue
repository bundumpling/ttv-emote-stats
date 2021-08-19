<template>
  <div class="options-panel block">
    <button class="button" @click="saveAll()">Save All Emotes</button>
    <button class="button" @click="randomizeCounts()">Randomize Counts</button>
    <button class="button" @click="zeroCounts()">Zero Counts</button>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";
import { IEmote } from "../types";
import logParser from "../utils/logParser";

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

    async function readLogFile(log: string | ArrayBuffer) {
      console.log(`in readLogFile`);
      const resultsMap: Map<any, any> = await logParser(
        log as string,
        store.state.channel.emotes
      );
      return resultsMap;
    }

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
          reader.onload = async (e) => {
            if (e.target && e.target.result) {
              let text = e.target.result;
              // store.commit(MutationType.ParseLog, text);
              const resultsMap = await readLogFile(text);
              store.commit(MutationType.SaveLogParserResults, resultsMap);
            }
          };
          console.log(`About to readAsText: ${files[i].name}`);
          reader.readAsText(files[i]);
        }
      }
    }

    // eslint-disable-next-line
    function saveAll(this: any) {
      type tProviderToParser = {
        [key: string]: IEmote[];
      };
      const providerToParser: tProviderToParser = {
        Twitch: this.parseTwitchEmotes,
        FFZ: this.parseFFZEmotes,
        BTTV: this.parseBTTVEmotes,
        "7TV": this.parse7TVEmotes,
      };

      let results: IEmote[] = [];

      for (let provider in store.state.providerAPIResults) {
        providerToParser[provider].forEach((emote: IEmote) => {
          results.push({ ...emote, provider, count: 0, usedBy: {} });
        });
      }
      store.commit(MutationType.UpdateEmotes, results);
    }

    // In order for the change event to fire, a different file must be uploaded.
    // By setting the input element's value to zero, the same log file can be processed multiple times.
    // document.getElementById("input").value = "";
    return {
      randomizeCounts,
      zeroCounts,
      logFileNames,
      saveAll,
    };
  },
});
</script>

<style lang="scss">
.options-panel {
  margin: 1em auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>