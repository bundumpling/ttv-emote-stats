<template>
  <div class="box emoteset">
    <img
      class="emote"
      v-for="emote in updatedEmotes"
      :key="emote.code"
      :src="emote.image"
      v-bind:style="{ 'border-color': calcBorderColor(emote) }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IEmoteForUpdate } from "../types";

export default defineComponent({
  name: "ManageUpdateEmotesCondensedView",
  props: {
    updatedEmotes: {
      type: Array as PropType<IEmoteForUpdate[]>,
      required: true,
    },
  },
  setup() {
    function calcBorderColor(emote: IEmoteForUpdate) {
      const borderColors = {
        isNew: "green",
        obsolete: "red",
        isUpdated: "blue",
      };

      if (emote.isNew) return borderColors.isNew;
      if (emote.obsolete) return borderColors.obsolete;
      if (emote.isUpdated) return borderColors.isUpdated;

      return "transparent";
    }

    return {
      calcBorderColor,
    };
  },
});
</script>

<style lang="scss">
.emote {
  border: 3px solid transparent;
  margin: 2px;
}
</style>