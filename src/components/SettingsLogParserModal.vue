<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Parsing Logs</p>
      </header>
      <section class="modal-card-body">
        <div class="message">
          {{ message }}
        </div>
        <progress class="progress" :value="progress" max="100">
          {{ progress }}
        </progress>
        <div class="console">
          <ul>
            <li v-for="(msg, i) in progressData.consoleMessages" :key="i">
              <span
                :class="msg.status"
                :id="
                  i === progressData.consoleMessages.length - 1
                    ? 'lastConsoleMessage'
                    : ''
                "
                >{{ `- ${msg.text}` }}</span
              >
            </li>
          </ul>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button @click="saveResultsToDB()" :disabled="!done">
          Save Results to DB
        </button>
        <button @click="closeModal()" :disabled="!done">Close Modal</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onUpdated } from "vue";
import { ParserStatus } from "../types";
export default defineComponent({
  name: "SettingsLogParserModal",
  props: {
    saveResultsToDB: {
      type: Function,
      required: true,
    },
    closeModal: {
      type: Function,
      required: true,
    },
    progressData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    onUpdated(() => {
      const lastMessage = document.getElementById("lastConsoleMessage");
      if (lastMessage) {
        lastMessage.scrollIntoView();
      }
    });

    const message = computed(() => {
      return props.progressData.status !== ParserStatus.DONE
        ? `${props.progressData.status} ${
            props.progressData.filenames[props.progressData.activeIndex]
          }`
        : "Done.";
    });

    const progress = computed(() => {
      if (props.progressData.status === ParserStatus.DONE) {
        return 100;
      } else {
        const result = Math.floor(
          (props.progressData.numParsed / props.progressData.filenames.length) *
            100
        );
        return isNaN(result) ? 0 : result;
      }
    });

    const done = computed(() => {
      return props.progressData.status === ParserStatus.DONE;
    });

    return {
      message,
      progress,
      done,
    };
  },
});
</script>

<style lang="scss">
.console {
  height: 240px;
  overflow-y: auto;
  background-color: #eee;
  font-size: 0.9em;
  font-family: monospace;
}

span.warn {
  color: red;
}
span.info {
  color: black;
}
span.success {
  color: green;
}
</style>