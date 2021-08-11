<template>
  <div class="column emote-api-control">
    <div class="emote-api-control-header">
      <span>{{ name }}</span>
    </div>
    <div class="emote-api-control-body">
      <button class="button" @click="getEmotes()">
        <font-awesome-icon icon="download" />Emotes
      </button>
      <div class="emote-api-control-emotelist-wrapper" v-if="emotes.length">
        <ul>
          <li v-for="emote in emotes" v-bind:key="emote.id">
            <img :src="emote.images.url_1x" :alt="emote.name" />
          </li>
        </ul>
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
</style>