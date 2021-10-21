<template>
  <div class="my-2 flex justify-evenly items-baseline">
    <SearchInput inject="emoteSearch" />
    <PerPageSelect />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PerPageSelect from "./ChannelControlsPerPageSelect.vue";
import SearchInput from "./SearchInput.vue";
export default defineComponent({
  name: "ChannelListControls",
  components: {
    PerPageSelect,
    SearchInput,
  },
});
</script>
