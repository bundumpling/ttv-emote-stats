<template>
  <TheSubheader :msg="`Channel Emote Rankings for ${channelName}`" />
  <Controls />
  <TabsContainer />
  <EmoteListContainer />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";

import TheSubheader from "../components/TheSubheader.vue";
import Controls from "../components/RankingsControls.vue";
import TabsContainer from "../components/RankingsTabContainer.vue";
import EmoteListContainer from "../components/RankingsEmoteListContainer.vue";

export default defineComponent({
  name: "RankingsPage",
  components: {
    TheSubheader,
    Controls,
    TabsContainer,
    EmoteListContainer,
  },
  setup() {
    const store = useStore();

    const channelName = computed(() => {
      return store.state.channel.name;
    });

    return {
      channelName,
    };
  },
});
</script>

<style>
</style>