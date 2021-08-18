<template>
  <div class="emotes-per-page">
    <label>Emotes per page: </label>
    <div class="select">
      <select @change="switchSelect($event)">
        <option :value="10" :selected="isSelected(10)">10</option>
        <option :value="25" :selected="isSelected(25)">25</option>
        <option :value="50" :selected="isSelected(50)">50</option>
        <option
          :value="Number.MAX_SAFE_INTEGER"
          :selected="isSelected(Number.MAX_SAFE_INTEGER)"
        >
          ALL
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";
export default defineComponent({
  name: "RankingsEmotesPerPageSelect",
  setup() {
    const store = useStore();

    function isSelected(value: number) {
      return store.state.emotesPerPage === value;
    }

    function switchSelect(event: Event) {
      const target = event.target as HTMLInputElement;
      const value = Number(target.value);
      store.commit(MutationType.SetEmotesPerPage, value);
    }

    return {
      isSelected,
      switchSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
.emotes-per-page {
  display: flex;
  justify-content: center;
  align-items: baseline;

  label {
    padding-right: 0.5em;
  }
}
</style>