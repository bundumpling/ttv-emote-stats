<template>
  <TopBar />
  <ChannelList />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopBar from "../components/AdminTopBar.vue"
import ChannelList from "../components/ChannelList.vue"

export default defineComponent({
  name: "AdminPage",
  components: {
    TopBar,
    ChannelList
  }
})
</script>