<template>
  <TheSubheader :msg="`Manage ${channelName}'s Channel`" />
  <div class="container tile-wrapper">
    <ManageMenuTile
      v-for="(tile, index) in tiles"
      :key="`${index}-${tile.text}`"
      :text="tile.text"
      :background-path="tile.background"
      :link-path="tile.link"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
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
        link: `/admin/${channelName}/update-emotes`,
      },
      {
        text: "Parse Logs",
        background: "ParseLogs-background-284x224.png",
        link: `/admin/${channelName}/parse-logs`,
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
