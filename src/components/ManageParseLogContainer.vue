<template>
  <div class="container box">
    <section class="main">
      <div class="input-side">
        <Filelist header="Uploaded" :list="uploadedList" />
      </div>
      <div class="middle">
        <UploadButton
          :disabled="uploadButtonDisabled"
          :handleUpload="handleLogFilesUpload"
        />
        <Statistics :stats="stats" />
      </div>
      <div class="output-side">
        <Filelist header="Parsed" :list="parsedList" />
        <Filelist header="Skipped/Error" :list="unparsedList" />
      </div>
    </section>
    <footer>
      <ProgressBar :progress="progress" />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "vue";
import { MutationType } from "../store/mutations";
import { useStore } from "../store";
import { useRoute } from "vue-router";
import {
  ParserStatus,
  LogParserProgressData,
  ILogParserResults,
} from "../types";
import logParser from "../helpers/logParser";
import Filelist from "./ManageParseLogFilelist.vue";
import UploadButton from "./ManageParseLogUploadButton.vue";
import Statistics from "./ManageParseLogStatistics.vue";
import ProgressBar from "./ManageParseLogProgressBar.vue";
export default defineComponent({
  name: "ParseLogsContainer",
  components: {
    Filelist,
    UploadButton,
    Statistics,
    ProgressBar,
  },
  setup() {
    const store = useStore();

    const route = useRoute();
    const channelName = route.params.channelName;

    const progressData: LogParserProgressData = reactive({
      uploadedList: [],
      parsedList: [],
      unparsedList: [],
      status: ParserStatus.IDLE,
      reset: function () {
        (this.uploadedList = []),
          (this.parsedList = []),
          (this.unparsedList = []),
          (this.status = ParserStatus.IDLE);
      },
    });

    const stats = reactive({
      emotesUsed: computed(() => {
        if (
          store.state.settings &&
          store.state.settings.logParserResults &&
          store.state.settings.logParserResults.emoteCounts
        ) {
          const emoteCodes = Object.keys(
            store.state.settings.logParserResults.emoteCounts
          );
          let total = 0;
          emoteCodes.forEach((code) => {
            if (store.state.settings.logParserResults.emoteCounts[code].count) {
              total++;
            }
          });
          return total;
        } else {
          return 0;
        }
      }),
      emotesTotal: computed(() => {
        if (
          store.state.settings &&
          store.state.settings.channelEmoteData &&
          store.state.settings.channelEmoteData.emoteCodes
        ) {
          return store.state.settings.channelEmoteData.emoteCodes.length;
        } else {
          return 0;
        }
      }),
      uniqueUsers: computed(() => {
        if (
          store.state.settings &&
          store.state.settings.logParserResults &&
          store.state.settings.logParserResults.usernameLastSeen
        ) {
          return Object.keys(
            store.state.settings.logParserResults.usernameLastSeen
          ).length;
        } else {
          return 0;
        }
      }),
      totalUsageCount: computed(() => {
        if (
          store.state.settings &&
          store.state.settings.logParserResults &&
          store.state.settings.logParserResults.emoteCounts
        ) {
          const emoteCodes = Object.keys(
            store.state.settings.logParserResults.emoteCounts
          );
          let total = 0;
          emoteCodes.forEach((code) => {
            total +=
              store.state.settings.logParserResults.emoteCounts[code].count;
          });
          return total;
        } else {
          return 0;
        }
      }),
    });

    const uploadButtonDisabled = computed(() =>
      Boolean(progressData.uploadedList.length)
    );

    const progress = computed(() => {
      if (progressData.status === ParserStatus.DONE) {
        return 100;
      } else {
        const { uploadedList, parsedList, unparsedList } = progressData;
        const result = Math.floor(
          ((parsedList.length + unparsedList.length) / uploadedList.length) *
            100
        );
        return isNaN(result) ? 0 : result;
      }
    });

    async function fetchListOfParsedLogFilenames() {
      return fetch(
        `http://localhost:8081/channel/${channelName}/listofParsedLogFilesnames`,
        { method: "GET" }
      ).then((res) => res.json());
    }

    async function readLogFile(log: string | ArrayBuffer) {
      const results: ILogParserResults = await logParser(
        log as string,
        store.state.settings.channelEmoteData.emoteCodes
      );
      return results;
    }

    async function handleLogFilesUpload() {
      progressData.status = ParserStatus.LOADING;
      let fileInput = document.getElementById(
        "logfile-input"
      ) as HTMLInputElement;
      if (fileInput.files) {
        const alreadyParsed = (await fetchListOfParsedLogFilenames()) || [];
        const files: FileList = fileInput.files;
        let unparsedFiles: File[] = [];

        for (let i = 0; i < files.length; i++) {
          const filename = files[i].name;
          progressData.uploadedList.push(filename);
          if (alreadyParsed.includes(filename)) {
            progressData.unparsedList.push(filename);
          } else {
            unparsedFiles.push(files[i]);
          }
        }

        if (!unparsedFiles.length) {
          progressData.status = ParserStatus.DONE;
        }

        for (let i = 0; i < unparsedFiles.length; i++) {
          let reader = new FileReader();
          reader.onerror = (e) => {
            if (e.target && e.target.error) {
              progressData.unparsedList.push(unparsedFiles[i].name);
            }
          };
          reader.onload = async (e) => {
            if (e.target && e.target.result) {
              let text = e.target.result;
              progressData.status = ParserStatus.PARSING;
              const filename = unparsedFiles[i].name;
              const logParserResult = await readLogFile(text);
              store.commit(MutationType.UpdateLogParserResults, {
                logFilename: filename,
                logParserResult,
              });
              -progressData.parsedList.push(filename);
              if (
                progressData.parsedList.length +
                  progressData.unparsedList.length ===
                progressData.uploadedList.length
              ) {
                progressData.status = ParserStatus.DONE;
              }
            }
          };
          reader.readAsText(unparsedFiles[i]);
        }
      } else {
        progressData.status = ParserStatus.DONE;
      }
    }

    return {
      uploadButtonDisabled,
      stats,
      progress,
      handleLogFilesUpload,
      ...progressData,
    };
  },
});
</script>

<style lang="scss">
.main {
  min-height: 600px;
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;

  & > div {
    width: 100%;
    max-height: 600px;
  }
}

.input-side {
  position: relative;

  & > div {
    height: 600px;
  }
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.output-side {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  & > :not(:last-child) {
    margin-bottom: 20px;
  }

  & > div {
    height: 290px;
  }
}

footer {
  margin-top: 1em;
}
</style>