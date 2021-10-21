<template>
  <div class="flex justify-center items-stretch">
    <label
      class="
        px-2
        text-lg
        font-semibold
        text-dark-100
        whitespace-nowrap
        select-none
      "
      >{{ label }}</label
    >
    <div class="flex justify-center items-stretch shadow-indigo-400 shadow-md">
      <div
        v-if="lockable"
        class="
          flex
          justify-center
          items-stretch
          border-1 border-cool-gray-300
          rounded-l-md
          bg-cool-gray-100
          cursor-pointer
        "
        @click="toggleLock"
      >
        <font-awesome-icon
          class="px-1 h-full min-w-6 text-center text-lg font-bold select-none"
          :icon="isLocked && isLocked() ? 'lock' : 'lock-open'"
        />
      </div>
      <input
        v-model="searchInput"
        :name="label"
        class="
          focus:outline-none
          border-t-1 border-b-1 border-cool-gray-300
          pl-1
        "
        :class="lockable ?? 'border-l-1 rounded-l-md'"
        type="text"
        :aria-label="ariaLabel"
        autocomplete="off"
        @input="validateInput"
      />
      <button
        class="
          border-1 border-cool-gray-300
          rounded-r-md
          min-w-7
          bg-rose-400
          font-bold
          text-dark-100
        "
        @click="reset"
      >
        Ｘ
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from "vue";
import { ISearchInput } from "@/types";

export default defineComponent({
  name: "SearchInput",
  props: {
    inject: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const {
      name,
      getInput,
      setInput,
      validationRegExp,
      reset,
      lockable,
      isLocked,
      toggleLock,
    } = inject(props.inject) as ISearchInput;

    const searchInput = computed({
      get: () => getInput(),
      set(value) {
        setInput(value.replace(validationRegExp, ""));
      },
    });

    const label = computed(() => {
      const splitOnCapitalLetters = name.split(/(?=[A-Z])/).join(" ");
      return `${splitOnCapitalLetters[0].toUpperCase()}${splitOnCapitalLetters.slice(
        1
      )}`;
    });

    const ariaLabel = computed(() =>
      name
        .split(/(?=[A-Z])/)
        .join(" ")
        .toLowerCase()
    );

    function validateInput(event: Event) {
      const { target } = event;
      let { value } = target as EventTarget & { value: string };
      if (target && validationRegExp.test(value)) {
        let resetEvent = document.createEvent("Event");
        resetEvent.initEvent(name, true, true);
        value = getInput();
        target.dispatchEvent(resetEvent);
      }
    }

    return {
      searchInput,
      validateInput,
      label,
      ariaLabel,
      reset,
      lockable,
      isLocked,
      toggleLock,
    };
  },
});
</script>
