<template>
  <TheSubheader :msg="`Manage ${channelName}'s Channel`" />
  <div class="container tile-wrapper">
    <ManageMenuTile
      v-for="(tile, index) in tiles"
      v-bind:key="`${index}-${tile.text}`"
      :text="tile.text"
      :backgroundPath="tile.background"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "../store";
import TheSubheader from "../components/TheSubheader.vue";
import ManageMenuTile from "../components/ManageMenuTile.vue";

export default defineComponent({
  name: "ManagePage",
  components: {
    TheSubheader,
    ManageMenuTile,
  },
  setup() {
    const route = useRoute();
    const channelName = route.params.channelName;

    const tiles = [
      {
        text: "Update Emotes",
        background: "UpdateEmotes-background-284x224.png",
      },
      {
        text: "Parse Logs",
        background: "ParseLogs-background-284x224.png",
      },
    ];

    return {
      channelName,
      tiles,
    };
  },
});
</script>

<style lang="scss">
.tile-wrapper {
  display: flex;
  justify-content: center;
}
</style>