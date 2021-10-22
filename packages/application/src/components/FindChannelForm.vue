<template>
  <form
    class="m-2 flex justify-center items-stretch"
    @submit.prevent="submitHandler"
  >
    <input
      id="channelName"
      v-model="channelName"
      type="text"
      class="
        p-2
        min-w-60
        border-1 border-r-0 border-blue-200
        rounded-l-md
        outline-none
        active:outline-none
      "
      aria-label="channel name"
      placeholder="Enter channel name..."
      spellcheck="false"
    />
    <button
      class="
        px-4
        py-2
        bg-blue-500
        font-bold
        text-warm-gray-200
        rounded-r-md
        disabled:bg-blue-200 disabled:cursor-not-allowed
        focus-within:outline-none
        focus:outline-none
      "
      :disabled="submitDisabled"
      @click="submitHandler"
    >
      Search
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "FindChannelForm",
  props: {
    value: {
      type: String,
      required: true,
    },
    updateValue: {
      type: Function as PropType<{ (newValue: string): void }>,
      required: true,
    },
    submitHandler: {
      type: Function as PropType<{
        (): Promise<void | [void, void, void, void] | undefined>;
      }>,
      required: true,
    },
    submitDisabled: {
      type: Boolean,
    },
  },
  computed: {
    channelName: {
      get() {
        return this.value;
      },
      set(channelName: string) {
        this.updateValue(channelName);
      },
    },
  },
});
</script>
