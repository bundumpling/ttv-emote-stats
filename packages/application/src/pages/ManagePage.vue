<template>
  <AdminTopBar />
  <TheSubheader :msg="`Manage ${channelName}'s Channel`" />
  <div class="flex justify-center">
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
import AdminTopBar from "@/components/AdminTopBar.vue";

export default defineComponent({
  name: "ManagePage",
  components: {
    AdminTopBar,
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
        link: `/admin/channel/${channelName}/update-emotes`,
      },
      {
        text: "Parse Logs",
        background: "ParseLogs-background-284x224.png",
        link: `/admin/channel/${channelName}/parse-logs`,
      },
    ];

    return {
      channelName,
      tiles,
    };
  },
});
</script>
