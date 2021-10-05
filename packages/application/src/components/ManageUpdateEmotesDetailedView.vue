<template>
  <table class="table">
    <thead>
      <tr>
        <th>IMG</th>
        <th>Code</th>
        <th>Provider</th>
        <th>New</th>
        <th>Unavailable</th>
        <th>Updated</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="emote in updatedEmotes" :key="emote.code">
        <td><img :src="emote.image" :alt="emote.code" /></td>
        <td class="emote-code">{{ emote.code }}</td>
        <td class="emote-provider">{{ emote.provider }}</td>
        <td>
          <font-awesome-icon
            v-if="Boolean(emote.isNew)"
            icon="check"
            class="checkmark"
          />
        </td>
        <td>
          <font-awesome-icon
            v-if="Boolean(emote.isUnavailable)"
            icon="check"
            class="checkmark"
          />
        </td>
        <td>
          <font-awesome-icon
            v-if="Boolean(emote.isUpdated)"
            icon="check"
            class="checkmark"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { EmoteForUpdate } from "../types";

export default defineComponent({
  name: "ManageUpdateEmotesDetailedView",
  props: {
    updatedEmotes: {
      type: Array as PropType<EmoteForUpdate[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.table {
  margin: 1em auto;
}

tr {
  text-align: center;
}

.emote-code {
  font-family: monospace;
}

.emote-provider {
  font-weight: bold;
}

.checkmark {
  font-size: 1.2em;
  color: green;
}
</style>