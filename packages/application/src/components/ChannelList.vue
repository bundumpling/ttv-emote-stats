<template>
  <div class="container">
    <TheSubheader msg="Channel List" />
    <ul class="channel-list">
      <li v-for="({ channelName, emoteCount, profileImageURL }, index) in channelList" :key="channelName + index" class="channel-listitem" @click="goToChannel(channelName)">
        <div class="channel-listitem-pfp"><img :src="profileImageURL" :alt="`profile image for ${channelName}`" /></div>
        <div class="channel-listitem-name">{{ channelName }}</div>
        <div><span class="channel-listitem-emotecount">{{ emoteCount }}</span> Emotes</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeMount, computed } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { useRoute, useRouter } from 'vue-router';
import TheSubheader from "./TheSubheader.vue";

export default defineComponent({
  name: "ChannelList",
  components: { 
    TheSubheader 
  },
  setup() {
    interface ChannelListItem {
      channelName: string,
      emoteCount: number
    }
    interface State {
      channelList: Array<ChannelListItem>
    }
    interface ChannelListResponse {
      channelList: Array<ChannelListItem>
    }

    const route = useRoute();
    const router = useRouter();
    
    const path = computed(() => route.path)

    const loading = ref(true);
    const error = ref(false);
    const state = reactive<State>({
      channelList: []
    });

    async function fetchData(): Promise<ChannelListResponse> {
      try {
        const URL = `http://localhost:8081/channels`;
        const response = await axios.get(URL) as AxiosResponse;
        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    }

    onBeforeMount(async () => {
      try {
        const { channelList } = await fetchData();
        state.channelList = channelList;
        loading.value = false;
      } catch (err) {
        error.value = true;
      }
    })

    const channelList = computed(() => state.channelList)

    function goToChannel(channelName: string) {
      if (path.value === "/admin/") {
        router.push(`/admin/${channelName}`)
      } else {
        router.push(`/channel/${channelName}`)
      }
    }

    return {
      channelList,
      goToChannel,
      loading,
      error
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  margin: 1em;
}
.header {
  text-align: center;
  font-size: 2em;
  font-weight: bold;
}

.channel-list {
  list-style: none;
  margin: 2em;
  display: flex;
  justify-content: space-evenly;;
}

.channel-listitem {
  margin: 8px;
  background-color: #EEE;
  border: 4px solid #999;
  border-radius: 4px;
  text-align: center;
  font-size: 1.2em;
  font-variant: small-caps;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: rgb(241, 206, 117);
    border-color: #333;
    color: #111;
  }
}

.channel-listitem-name {
  font-size: 1.5em;
  text-decoration: underline;
  font-variant: normal;
}
.channel-listitem-emotecount {
  font-size: 1.2em;
  font-variant: normal;
}
</style>