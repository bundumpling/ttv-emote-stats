<template>
  <div id="emote-list">
    <div
      class="columns"
      v-for="(emote, index) in sharedState.seedData"
      v-bind:key="emote.name"
    >
      <div class="column is-1">
        {{ index + 1 }}
      </div>
      <div class="column is-1">
        <img
          class="image is-24x24"
          v-bind:src="
            'img/emotes/' + emote.name + (emote.animated ? '.gif' : '.png')
          "
        />
      </div>
      <div class="column is-1">
        {{ emote.count }}
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "../store.js";

export default {
  name: "EmoteList",
  data() {
    return {
      sharedState: store.state,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
