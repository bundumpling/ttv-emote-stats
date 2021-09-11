<template>
  <div class="options-panel block">
    <button class="button" @click="saveAll()">Save All Emotes</button>
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

    const logParserProgressData: tLogParserProgressData = reactive({
      filenames: [],
      parsedFilenames: [],
      skippedFilenames: [],
      consoleMessages: [],
      activeIndex: null,
      numParsed: 0,
      status: ParserStatus.IDLE,
      errors: [],
      reset: function () {
        (this.filenames = []),
          (this.activeIndex = null),
          (this.parsedFilenames = []),
          (this.skippedFilenames = []),
          (this.consoleMessages = []),
          (this.numParsed = 0),
          (this.status = ParserStatus.IDLE),
          (this.errors = []);
      },
    });

    function resetFileInputElement() {
      const inputElement = document.getElementById(
        "logfile-input"
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }
    }

    function closeModal(): void {
      logParserModalIsActive.value = false;
      logParserProgressData.reset();
      resetFileInputElement();
    }

    function saveResultsToDB(): void {
      store.dispatch("saveLogParserResultsToDB");
      resetFileInputElement();
    }

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
        const alreadyParsed = (await fetchListOfParsedLogFilenames()) || [];
        const files: FileList = fileInput.files;
        logParserProgressData.consoleMessages.push({
          status: "info",
          text: `Received ${files.length} files to process.`,
        });

        let unparsedFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
          const filename = files[i].name;
          if (alreadyParsed.includes(filename)) {
            logParserProgressData.consoleMessages.push({
              status: "warn",
              text: `${filename} already recorded as parsed in database... skipping.`,
            });
            logParserProgressData.skippedFilenames.push(filename);
          } else {
            unparsedFiles.push(files[i]);
            logParserProgressData.consoleMessages.push({
              status: "info",
              text: `${filename} added to parsing queue.`,
            });
          }
        }

        logParserProgressData.filenames.length = unparsedFiles.length;

        if (!unparsedFiles.length) {
          logParserProgressData.consoleMessages.push({
            status: "warn",
            text: "All of the logfiles added have already been parsed according to the database... exiting.",
          });
          logParserProgressData.status = ParserStatus.DONE;
        }

        for (let i = 0; i < unparsedFiles.length; i++) {
          let reader = new FileReader();
          reader.onerror = (e) => {
            if (e.target && e.target.error) {
              const errorMessage = `${e.target.error.name} reading ${unparsedFiles[i].name}... skipping.`;
              logParserProgressData.consoleMessages.push({
                status: "warn",
                text: errorMessage,
              });
              logParserProgressData.numParsed++;
            }
          };
          reader.onload = async (e) => {
            if (e.target && e.target.result) {
              let text = e.target.result;
              logParserProgressData.activeIndex = i;
              logParserProgressData.status = ParserStatus.PARSING;
              const filename = unparsedFiles[i].name;
              const logParserResult = await readLogFile(text);
              store.commit(MutationType.UpdateLogParserResults, {
                logFilename: filename,
                logParserResult,
              });
              logParserProgressData.consoleMessages.push({
                status: "success",
                text: `${filename} parsed successfully.`,
              });
              logParserProgressData.parsedFilenames.push(filename);
              logParserProgressData.numParsed++;
              if (
                logParserProgressData.numParsed ===
                logParserProgressData.filenames.length
              ) {
                logParserProgressData.consoleMessages.push({
                  status: "success",
                  text: "Done parsing log files.",
                });
                logParserProgressData.status = ParserStatus.DONE;
              }
            }
          };
          logParserProgressData.filenames[i] = unparsedFiles[i].name;
          reader.readAsText(unparsedFiles[i]);
        }
      } else {
        logParserProgressData.consoleMessages.push({
          status: "warn",
          text: "No log files received to parse.",
        });
        logParserProgressData.status = ParserStatus.DONE;
      }
    }

    function saveAll() {
      // TODO
    }

    // In order for the change event to fire, a different file must be uploaded.
    // By setting the input element's value to zero, the same log file can be processed multiple times.
    // document.getElementById("input").value = "";
    return {
      logFileNames,
      saveAll,
      logParserModalIsActive,
      logParserProgressData,
      saveResultsToDB,
      closeModal,
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