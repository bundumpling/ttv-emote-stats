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
        <div class="errors">
          <ul>
            <li
              class="error-message"
              v-for="(error, i) in errors"
              :key="`error-${i} ${Math.random()}`"
            >
              {{ error }}
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
import { defineComponent, computed } from "vue";
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
    const message = computed(() => {
      return props.progressData.status !== ParserStatus.DONE
        ? `${props.progressData.status} ${
            props.progressData.filenames[props.progressData.activeIndex]
          }`
        : "Done.";
    });

    const progress = computed(() => {
      return props.progressData.status === ParserStatus.DONE
        ? 100
        : Math.floor(
            (props.progressData.numParsed /
              props.progressData.filenames.length) *
              100
          );
    });

    const errors = computed(() => {
      return [...props.progressData.errors];
    });

    const done = computed(() => {
      return props.progressData.status === ParserStatus.DONE;
    });

    return {
      message,
      progress,
      errors,
      done,
    };
  },
});
</script>

<style>
</style>