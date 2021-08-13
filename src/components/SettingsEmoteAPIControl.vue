<template>
  <div class="emote-api-control">
    <div class="emote-api-control-header">
      <div class="emote-api-control-header-provider">{{ provider }}</div>
      <button
        class="button is-outlined"
        :class="!providerIsAvailable(provider) ? 'is-danger' : 'is-success'"
        @click="getProviderEmotes(provider)"
      >
        <font-awesome-icon
          :icon="
            emotes.length || !providerIsAvailable(provider)
              ? 'redo'
              : 'download'
          "
        /><span class="button-text">{{
          emotes.length
            ? "Refresh"
            : !providerIsAvailable(provider)
            ? "Retry"
            : "Download"
        }}</span>
      </button>
    </div>
    <div class="emote-api-control-body">
      <div
        class="emote-api-control-unavailable has-text-danger"
        v-if="!providerIsAvailable(provider)"
      >
        No Emotes Available
      </div>
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
    provider: String,
    emotes: Array,
    getProviderEmotes: Function,
    providerIsAvailable: Function,
  },
};
</script>

<style>
.button-text {
  padding-left: 0.25em;
  font-variant: small-caps;
}

.emote-api-control {
  margin: 0 1em;
  max-width: 260px;
}

.emote-api-control-header {
  display: flex;
  justify-content: space-between;
  align-content: center;
  border-bottom: 4px solid #333;
  padding-bottom: 0.25em;
}

.emote-api-control-header-provider {
  font-size: 1.75em;
  font-weight: bold;
  padding-right: 0.5em;
}

.emote-api-control-emotelist-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: flex-start;
  padding-top: 0.25em;
}

.emote-api-control-unavailable {
  font-size: 1.5em;
  text-align: center;
  font-variant: small-caps;
}
</style>