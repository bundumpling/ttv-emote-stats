<template>
  <div class="file">
    <label class="file-label">
      <input
        id="logfile-input"
        class="file-input"
        name="logs"
        type="file"
        multiple
        :disabled="disabled"
        @change="handleUpload"
      />
      <span class="file-cta">
        <span class="file-icon">
          <font-awesome-icon icon="upload" />
        </span>
        <span class="file-label">Upload Logfile(s)</span>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ParseLogsUploadButton",
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    handleUpload: {
      type: Function,
      required: true,
    },
  },
});
</script>
