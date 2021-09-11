<template>
  <TheSubheader :msg="`Channel Emote Rankings for ${channelName}`" />
  <Controls />
  <EmoteListContainer />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "../store";

import TheSubheader from "../components/TheSubheader.vue";
import Controls from "../components/ChannelControls.vue";
import EmoteListContainer from "../components/ChannelEmoteListContainer.vue";

export default defineComponent({
  name: "ChannelPage",
  components: {
    TheSubheader,
    Controls,
    EmoteListContainer,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    const channelName = route.params.channelName;

    onMounted(() => {
      store.dispatch("fetchChannelEmoteCounts", channelName);
    });

    return {
      channelName,
    };
  },
});
</script>

<style>
</style>