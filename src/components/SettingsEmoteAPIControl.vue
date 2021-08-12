<template>
  <div class="column emote-api-control">
    <div class="emote-api-control-header">
      <div class="emote-api-control-header-provider">{{ name }}</div>
      <button class="button" @click="getEmotes()">
        <font-awesome-icon :icon="emotes.length ? 'redo' : 'download'" /><span
          class="button-text"
          >{{ emotes.length ? "Refresh" : "Download" }}</span
        >
      </button>
    </div>
    <div class="emote-api-control-body">
      <div class="emote-api-control-emotelist-wrapper" v-if="emotes.length">
        <div v-for="emote in emotes" v-bind:key="emote.id">
          <img :src="emote.image" :alt="emote.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsEmoteApiControl",
  props: {
    name: String,
    emotes: Array,
    getEmotes: Function,
  },
};
</script>

<style>
.button-text {
  padding-left: 0.25em;
  font-variant: small-caps;
}

.emote-api-control-header {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.emote-api-control-header-provider {
  font-size: 1.5em;
  font-weight: bold;
}

.emote-api-control-emotelist-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
}
</style>