<template>
  <div>
    <TheSubheader
      :msg="`Parse Emote Usage from Chat Logs for ${channelName}'s Channel`"
    />
    <div v-if="!loading">
      <section class="info">
        <p>
          This is a tool for parsing log files from <strong>Chatterino</strong>.
          In order to work properly, a log file <strong>must</strong> follow a
          particular format:
        </p>
        <ul>
          <li>
            The first line is a 'start logging' status message providing the
            date, e.g.
            <code
              ># Start logging at 2021-09-13 00:21:25 Eastern Daylight
              Time</code
            >
          </li>
          <li>
            Each chat line must begin with a timestamp, e.g.
            <code>[00:24:44]</code>
          </li>
          <li>
            Each chat line must have a colon following the username, e.g.
            <code>[01:41:29] twitchuser: hi streamer and chat FrankerZ</code>
          </li>
        </ul>
      </section>
      <div class="container box">
        <section class="main">
          <div class="input-side">
            <div class="filelist">
              <h3>Uploaded</h3>
              <ul>
                <li
                  v-for="(filename, i) in progressData.uploadedList"
                  :key="`${filename}-${i}`"
                >
                  {{ filename }}
                </li>
              </ul>
            </div>
          </div>
          <div class="middle">
            <UploadButton
              v-if="!uploadButtonDisabled"
              :disabled="uploadButtonDisabled"
              :handle-upload="handleLogFilesUpload"
            />
            <Status v-else :status="progressData.status" :reset="reset" />
            <Statistics
              :stats="{ emotesUsed, emotesTotal, uniqueUsers, totalUsageCount }"
            />
          </div>
          <div class="output-side">
            <div class="filelist">
              <h3>Parsed</h3>
              <ul>
                <li
                  v-for="(filename, i) in progressData.parsedList"
                  :key="`${filename}-${i}`"
                >
                  {{ filename }}
                </li>
              </ul>
            </div>
            <div class="filelist">
              <h3>Skipped/Error</h3>
              <ul>
                <li
                  v-for="(filename, i) in progressData.skippedList"
                  :key="`${filename}-${i}`"
                  class="listitem-skipped"
                >
                  {{ filename }}
                </li>
                <li
                  v-for="(filename, i) in progressData.errorList"
                  :key="`${filename}-${i}`"
                  class="listitem-error"
                >
                  {{ filename }}
                </li>
              </ul>
            </div>
          </div>
        </section>
        <footer>
          <ProgressBar :progress="progress" />
        </footer>
      </div>
    </div>
    <Loading v-else-if="!error" />
    <div v-else class="error">Error</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import axios, { AxiosResponse } from "axios";
import { LogParserResult, ParseLogsState, ParserStatus } from "@/types";
import logParser from "../helpers/logParser";
import TheSubheader from "../components/TheSubheader.vue";
import Loading from "../components/TheLoadingSpinner.vue";
import UploadButton from "../components/ParseLogsUploadButton.vue";
import Status from "../components/ParseLogsStatus.vue";
import Statistics from "../components/ParseLogsStatistics.vue";
import ProgressBar from "../components/ParseLogsProgressBar.vue";
export default defineComponent({
  name: "ParseLogsPage",
  components: {
    TheSubheader,
    UploadButton,
    Status,
    Statistics,
    ProgressBar,
    Loading,
  },
  setup() {
    const route = useRoute();
    const channelName = route.params.channelName;

    const loading = ref(true);
    const error = ref(false);

    const state = reactive<ParseLogsState>({
      channelID: "",
      emoteCodes: [],
      progressData: {
        uploadedList: [],
        parsedList: [],
        skippedList: [],
        errorList: [],
        status: ParserStatus.IDLE,
      },
      logParserResults: {
        emoteCounts: {},
        usernameLastSeen: {},
      },
      logParserFilenames: [],
    });

    async function fetchData() {
      try {
        const URL = `http://localhost:8081/channel/${channelName}/emoteCodes`;
        const token = localStorage.getItem("user");
        const response = await axios.get(URL, {
          headers: { authorization: token },
        });
        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    }

    onBeforeMount(async () => {
      try {
        const { channelID, emoteCodes } = await fetchData();
        state.channelID = channelID;
        state.emoteCodes = emoteCodes;
        loading.value = false;
      } catch (err) {
        error.value = true;
      }
    });

    const channelID = computed(() => state.channelID);
    const emoteCodes = computed(() => state.emoteCodes);

    const emotesUsed = computed(() => {
      let total = 0;
      Object.keys(state.logParserResults.emoteCounts).forEach((code) => {
        if (state.logParserResults.emoteCounts[code].count) {
          total++;
        }
      });
      return total;
    });
    const emotesTotal = computed(() => state.emoteCodes.length);
    const uniqueUsers = computed(
      () => Object.keys(state.logParserResults.usernameLastSeen).length
    );
    const totalUsageCount = computed(calcTotalUsageCount);

    const uploadButtonDisabled = computed(() =>
      Boolean(state.progressData.uploadedList.length)
    );

    const progress = computed(() => {
      if (state.progressData.status === ParserStatus.DONE) {
        return 100;
      } else {
        const { uploadedList, parsedList, skippedList, errorList } =
          state.progressData;
        const result = Math.floor(
          ((parsedList.length + skippedList.length + errorList.length) /
            uploadedList.length) *
            100
        );
        return isNaN(result) ? 0 : result;
      }
    });

    function calcTotalUsageCount() {
      const emoteCodes = Object.keys(state.logParserResults.emoteCounts);
      let total = 0;
      emoteCodes.forEach((code) => {
        total += state.logParserResults.emoteCounts[code].count;
      });
      return total;
    }

    async function fetchListOfParsedLogs() {
      try {
        const URL = `http://localhost:8081/channel/${channelName}/listOfParsedLogs`;
        const token = localStorage.getItem("user");
        const response = await axios.get(URL, {
          headers: { authorization: token },
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }

    async function readLogFile(log: string | ArrayBuffer | null) {
      const results: LogParserResult | null = await logParser(
        log as string,
        state.emoteCodes
      );
      return results;
    }

    async function handleLogFilesUpload() {
      state.progressData.status = ParserStatus.LOADING;
      let fileInput = document.getElementById(
        "logfile-input"
      ) as HTMLInputElement;
      if (fileInput.files) {
        const alreadyParsed = (await fetchListOfParsedLogs()) || [];
        const files: FileList = fileInput.files;
        let unparsedFiles: File[] = [];

        for (let i = 0; i < files.length; i++) {
          const filename = files[i].name;
          state.progressData.uploadedList.push(filename);
          if (alreadyParsed.includes(filename)) {
            state.progressData.skippedList.push(filename);
          } else {
            unparsedFiles.push(files[i]);
          }
        }

        if (!unparsedFiles.length) {
          state.progressData.status = ParserStatus.DONE;
        }

        for (let i = 0; i < unparsedFiles.length; i++) {
          let reader = new FileReader();
          reader.onerror = (e) => {
            if (e.target && e.target.error) {
              state.progressData.errorList.push(unparsedFiles[i].name);
            }
          };
          reader.onload = async (e) => {
            if (e.target && e.target.result) {
              let text = e.target.result;
              state.progressData.status = ParserStatus.PARSING;
              const filename = unparsedFiles[i].name;
              const logParserResult = await readLogFile(text);
              if (!logParserResult) {
                state.progressData.errorList.push(filename);
              } else {
                updateLogParserResults(filename, logParserResult);
                state.progressData.parsedList.push(filename);
              }
              if (
                state.progressData.parsedList.length +
                  state.progressData.skippedList.length +
                  state.progressData.errorList.length ===
                state.progressData.uploadedList.length
              ) {
                if (state.progressData.parsedList.length) {
                  saveLogParserResultsToDb().then(() => {
                    state.progressData.status = ParserStatus.DONE;
                  });
                } else {
                  state.progressData.status = ParserStatus.IDLE;
                }
              }
            }
          };
          reader.readAsText(unparsedFiles[i]);
        }
      } else {
        state.progressData.status = ParserStatus.DONE;
      }
    }

    async function saveLogParserResultsToDb() {
      const logFilenames = state.logParserFilenames;
      const logParserResults = state.logParserResults;
      const URL = `http://localhost:8081/channel/${channelName}/updateCountsFromLog`;
      const token = localStorage.getItem("user");
      const requestbody = {
        logFilenames,
        logParserResults,
      };
      const requestHeaders = {
        headers: {
          authorization: token
        }
      };
      const response = (await axios.post(URL, requestbody, requestHeaders)) as AxiosResponse;
      return response;
    }

    function updateLogParserResults(
      logFilename: string,
      logParserResult: LogParserResult
    ) {
      if (!Object.keys(state.logParserResults).length) {
        state.logParserResults = logParserResult;
      } else {
        const { logDate, usernameLastSeen, emoteCounts } = logParserResult;
        Object.keys(emoteCounts).forEach((key) => {
          const value = emoteCounts[key];
          if (value.count && value.usedBy) {
            if (state.logParserResults.emoteCounts[key]) {
              state.logParserResults.emoteCounts[key].count += value.count;
              if (
                logDate &&
                state.logParserResults.emoteCounts[key].usedOn[logDate]
              ) {
                state.logParserResults.emoteCounts[key].usedOn[logDate] +=
                  value.count;
              } else if (logDate) {
                state.logParserResults.emoteCounts[key].usedOn[logDate] =
                  value.count;
              }
              Object.keys(value.usedBy).forEach((username) => {
                if (value.usedBy) {
                  if (
                    state.logParserResults.emoteCounts[key].usedBy[username]
                  ) {
                    state.logParserResults.emoteCounts[key].usedBy[username] +=
                      value.usedBy[username];
                  } else {
                    state.logParserResults.emoteCounts[key].usedBy[username] =
                      value.usedBy[username];
                  }
                }
              });
            } else if (logDate) {
              value.usedOn[logDate] = value.count;
              state.logParserResults.emoteCounts[key] = value;
            }
          }
        });
        Object.keys(usernameLastSeen).forEach((username) => {
          const timestamp = usernameLastSeen[username];
          if (timestamp) {
            if (state.logParserResults.usernameLastSeen[username]) {
              state.logParserResults.usernameLastSeen[username] = Math.max(
                state.logParserResults.usernameLastSeen[username],
                timestamp
              );
            } else {
              state.logParserResults.usernameLastSeen[username] = timestamp;
            }
          }
        });
      }
      state.logParserFilenames = [logFilename, ...state.logParserFilenames];
    }

    function reset() {
      state.progressData.uploadedList = [];
      state.progressData.parsedList = [];
      state.progressData.skippedList = [];
      state.progressData.errorList = [];
      state.progressData.status = ParserStatus.IDLE;
      state.logParserResults.emoteCounts = {};
      state.logParserResults.usernameLastSeen = {};
      state.logParserFilenames = [];
    }

    return {
      channelName,
      channelID,
      emoteCodes,
      uploadButtonDisabled,
      emotesUsed,
      emotesTotal,
      uniqueUsers,
      totalUsageCount,
      progress,
      handleLogFilesUpload,
      progressData: computed(() => state.progressData),
      reset,
      loading,
      error,
      // saveAll,
      // saveResultsToDB,
    };
  },
});
</script>

<style lang="scss" scoped>
.info {
  width: 70%;
  margin: 1em auto;

  ul {
    padding: 0 1em;
    list-style-type: circle;
    list-style-position: inside;
    text-align: left;

    li {
      text-align: left;
    }
  }
}
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
.listitem-skipped {
  text-decoration: line-through;
}
.listitem-error {
  color: maroon;
}
</style>
