<template>
  <button
    class="button is-outlined"
    :class="!isAvailable ? 'is-danger' : 'is-success'"
    @click="getProviderEmotes(provider)"
  >
    <font-awesome-icon
      :icon="hasEmotes || !isAvailable ? 'redo' : 'download'"
    /><span class="button-text">{{
      hasEmotes ? "Refresh" : !isAvailable ? "Retry" : "Download"
    }}</span>
  </button>
</template>

<script>
export default {
  name: "SettingsAPIControlButton",
  props: {
    provider: String,
  },
  computed: {
    isAvailable() {
      return this.$store.state.providerAvailability[this.provider];
    },
    hasEmotes() {
      return this.$store.state.providerAPIResults[this.provider].length;
    },
  },
  methods: {
    getProviderEmotes(provider) {
      const URLS = {
        Twitch: `http://localhost:8081/twitch/emotes?id=${this.$store.state.channel.twitchID}`,
        FFZ: `http://localhost:8081/ffz/emotes?id=${this.$store.state.channel.twitchID}`,
        BTTV: `http://localhost:8081/bttv/emotes?id=${this.$store.state.channel.twitchID}`,
        "7TV": `http://localhost:8081/7tv/emotes?name=${this.$store.state.channel.name}`,
      };

      fetch(URLS[provider], { method: "GET" })
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            throw new Error(json.error);
          }
          this.$store.commit("setProviderAPIResults", {
            provider,
            emotes: json,
          });
        })
        .catch((error) => {
          console.error(error);
          this.$store.commit("setProviderAvailability", {
            provider,
            isAvailable: false,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.button-text {
  padding-left: 0.25em;
  font-variant: small-caps;
}
</style>