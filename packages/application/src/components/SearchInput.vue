<template>
  <div class="search-input-wrapper">
    <font-awesome-icon
      v-if="lockable"
      class="search-input-lock"
      :icon="isLocked() ? 'lock' : 'lock-open'"
      @click="toggleLock"
    />
    <label>{{ label }}:</label>
    <input
      v-model="searchInput"
      :name="label"
      class="input is-small"
      type="text"
      :aria-label="ariaLabel"
      autocomplete="off"
      @input="validateInput"
    />
    <span class="search-input-reset" @click="reset">Ｘ</span>
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

    function validateInput(event: InputEvent) {
      if (validationRegExp.test(event.target.value)) {
        let resetEvent = document.createEvent("Event");
        resetEvent.initEvent(name, true, true);
        event.target.value = getInput();
        event.target.dispatchEvent(resetEvent);
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

<style lang="scss" scoped>
.search-input-wrapper {
  margin: 0 auto;
  padding-bottom: 1em;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: baseline;

  label {
    padding-right: 0.5em;
    white-space: nowrap;
  }
  input {
    height: 2em;
  }

  .search-input-lock {
    text-align: center;
    min-width: 24px;
    cursor: pointer;
  }

  .search-input-reset {
    padding-left: 4px;
    font-weight: bold;
    color: maroon;
    cursor: pointer;
  }
}
</style>
