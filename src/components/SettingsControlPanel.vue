<template>
  <div class="options-panel block">
    <button class="button" @click="saveAll()">Save All Emotes</button>
    <button class="button" @click="randomizeCounts()">Randomize Counts</button>
    <button class="button" @click="zeroCounts()">Zero Counts</button>
    <div class="file">
      <label class="file-label">
        <input
          id="logfile-input"
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
    <div class="file">
      <label class="file-label">
        <input
          id="statefile-input"
          class="file-input"
          name="loadState"
          type="file"
          @change="loadStateFromFile()"
        />
        <span class="file-cta">
          <span class="file-icon">
            <font-awesome-icon icon="upload" />
          </span>
          <span class="file-label">Load State From File</span>
        </span>
      </label>
    </div>
    <button class="button" @click="createDownloadableBlobFromState()">
      Create Blob from State
    </button>
    <a
      class="button"
      :href="blobURL"
      :download="blobURLDownloadAs"
      v-show="blobURLReady"
      >Download State</a
    >
  </div>
  <SettingsLogParserModal
    v-if="logParserModalIsActive"
    :progressData="logParserProgressData"
    :saveResultsToDB="saveResultsToDB"
    :closeModal="closeModal"
  />
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";
import {
  IEmote,
  ILogParserResults,
  ParserStatus,
  tLogParserProgressData,
} from "../types";
import {
  fromTwitch,
  fromFFZ,
  fromBTTV,
  from7TV,
} from "../helpers/parseEmotesByProvider";
import logParser from "../helpers/logParser";
import SettingsLogParserModal from "./SettingsLogParserModal.vue";

export default defineComponent({
  name: "SettingsControlPanel",
  components: {
    SettingsLogParserModal,
  },
  setup() {
    const store = useStore();

    const logParserModalIsActive = ref(false);
    const blobURLReady = ref(false);
    const blobURL = ref("");
    const blobURLDownloadAs = ref("");

    const logParserProgressData: tLogParserProgressData = reactive({
      filenames: [],
      parsedFilenames: [],
      skippedFilenames: [],
      activeIndex: null,
      numParsed: 0,
      status: ParserStatus.IDLE,
      errors: [],
      reset: function () {
        (this.filenames = []),
          (this.activeIndex = null),
          (this.numParsed = 0),
          (this.status = ParserStatus.IDLE),
          (this.errors = []);
      },
    });

    function closeModal(): void {
      logParserModalIsActive.value = false;
      logParserProgressData.reset();
    }

    function saveResultsToDB(): void {
      store.dispatch("saveLogParserResultsToDB");
    }

    const randomizeCounts = () => {
      store.commit(MutationType.RandomizeCounts, undefined);
    };

    const zeroCounts = () => {
      store.commit(MutationType.ZeroCounts, undefined);
    };

    async function readLogFile(log: string | ArrayBuffer) {
      const results: ILogParserResults = await logParser(
        log as string,
        store.state.channel.emotes
      );
      return results;
    }

    async function fetchListOfParsedLogFilenames() {
      return fetch(
        `http://localhost:8081/channel/${store.state.channel.name}/listofParsedLogFilesnames`,
        { method: "GET" }
      ).then((res) => res.json());
    }

    async function logFileNames() {
      logParserProgressData.status = ParserStatus.LOADING;
      logParserModalIsActive.value = true;
      let fileInput = document.getElementById(
        "logfile-input"
      ) as HTMLInputElement;
      if (fileInput.files) {
        const alreadyParsed = await fetchListOfParsedLogFilenames();
        console.log(alreadyParsed);

        const files: FileList = fileInput.files;
        let unparsedFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
          const filename = files[i].name;
          if (alreadyParsed.includes(filename)) {
            console.log(`${filename} already parsed according to DB.`);
            logParserProgressData.skippedFilenames.push(filename);
          } else {
            unparsedFiles.push(files[i]);
          }
        }

        logParserProgressData.filenames.length = unparsedFiles.length;

        if (!unparsedFiles.length) {
          logParserProgressData.status = ParserStatus.DONE;
        }

        for (let i = 0; i < unparsedFiles.length; i++) {
          let reader = new FileReader();
          reader.onerror = (e) => {
            if (e.target && e.target.error) {
              const errorMessage = `${e.target.error.name} reading ${unparsedFiles[i].name}`;
              console.log(errorMessage);
              logParserProgressData.errors.push(errorMessage);
              logParserProgressData.numParsed++;
            }
          };
          reader.onload = async (e) => {
            if (e.target && e.target.result) {
              let text = e.target.result;
              logParserProgressData.activeIndex = i;
              logParserProgressData.status = ParserStatus.PARSING;
              const logParserResult = await readLogFile(text);
              store.commit(MutationType.UpdateLogParserResults, {
                logFilename: unparsedFiles[i].name,
                logParserResult,
              });
              logParserProgressData.parsedFilenames.push(unparsedFiles[i].name);
              logParserProgressData.numParsed++;
              if (
                logParserProgressData.numParsed ===
                logParserProgressData.filenames.length
              ) {
                logParserProgressData.status = ParserStatus.DONE;
              }
            }
          };
          logParserProgressData.filenames[i] = unparsedFiles[i].name;
          reader.readAsText(unparsedFiles[i]);
        }
      } else {
        logParserProgressData.status = ParserStatus.DONE;
      }
    }

    // eslint-disable-next-line
    function saveAll() {
      type tProviderToParser = {
        [key: string]: IEmote[];
      };
      const providerToParser: tProviderToParser = {
        Twitch: fromTwitch(store.state),
        FFZ: fromFFZ(store.state),
        BTTV: fromBTTV(store.state),
        "7TV": from7TV(store.state),
      };

      let results: IEmote[] = [];

      for (let provider in store.state.providerAPIResults) {
        if (providerToParser[provider].length) {
          providerToParser[provider].forEach((emote: IEmote) => {
            results.push({ ...emote, provider });
          });
        }
      }
      store.commit(MutationType.UpdateEmotes, results);
    }

    function createDownloadableBlobFromState() {
      const blob = new Blob([JSON.stringify(store.state, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      blobURL.value = url;
      blobURLReady.value = true;
      blobURLDownloadAs.value = `state-${Date.now()}`;
    }

    async function parseJSONFile(json: string | ArrayBuffer) {
      return JSON.parse(json as string);
    }

    function loadStateFromFile() {
      let fileInput = document.getElementById(
        "statefile-input"
      ) as HTMLInputElement;
      if (fileInput.files) {
        let file: File = fileInput.files[0];
        let reader = new FileReader();
        reader.onerror = (e) => {
          if (e.target && e.target.error) {
            console.log(e.target.error.name);
          }
        };
        reader.onload = async (e) => {
          if (e.target && e.target.result) {
            let jsonString = e.target.result;
            const json = await parseJSONFile(jsonString);
            store.replaceState(json);
          }
        };
        reader.readAsText(file);
      }
    }

    // In order for the change event to fire, a different file must be uploaded.
    // By setting the input element's value to zero, the same log file can be processed multiple times.
    // document.getElementById("input").value = "";
    return {
      randomizeCounts,
      zeroCounts,
      logFileNames,
      saveAll,
      logParserModalIsActive,
      logParserProgressData,
      saveResultsToDB,
      closeModal,
      createDownloadableBlobFromState,
      blobURL,
      blobURLReady,
      blobURLDownloadAs,
      loadStateFromFile,
    };
  },
});
</script>

<style lang="scss">
.options-panel {
  margin: 1em auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>