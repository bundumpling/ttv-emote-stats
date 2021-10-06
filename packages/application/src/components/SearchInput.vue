<template>
    <label>{{ label }}:</label>
    <input
      v-model="searchInput"
      :name="injectedName"
      class="input is-small"
      type="text"
      :aria-label="ariaLabel"
      autocomplete="off"
      @input="validateInput"
    />
</template>

<script lang="ts">
import { defineComponent, computed, inject } from "vue";

export default defineComponent({
  name: "SearchInput",
  props: {
    injectedName: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  setup(props) {
    type SearchInputState = {
      setInput: {
        type: (value: string) => void,
        required: true
      },
      getInput: {
        type: () => string,
        required: true
      },
      validationRegExp: {
        type: RegExp,
        required: true
      }
    }

    const state = inject(props.injectedName) as SearchInputState;

    const searchInput = computed({
      get: () => state.getInput(),
      set(value) {
        state.setInput(value.replace(state.validationRegExp, ''))
      },
    });

    function validateInput(event: InputEvent) {      
      if (state.validationRegExp.test(event.target.value)) {
        let resetEvent = document.createEvent('Event');
        resetEvent.initEvent(props.injectedName, true, true);
        event.target.value = state.getInput();
        event.target.dispatchEvent(resetEvent);
      }
    }

    const ariaLabel = computed(() => props.injectedName.split(/(?=[A-Z])/).join(" ").toLowerCase());

    return {
      searchInput,
      validateInput,
      ariaLabel
    };
  },
});
</script>

<style lang="scss" scoped>
label {
  padding-right: 0.5em;
  white-space: nowrap;
}
</style>