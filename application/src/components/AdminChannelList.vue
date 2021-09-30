<template>
  <div class="container">
    <TheSubheader msg="Channel List" />
    <ul class="channel-list">
      <li v-for="({ channelName, emoteCount }, index) in channelList" :key="channelName + index" class="channel-listitem box" @click="goToChannel(channelName)">
        <div class="channel-listitem-name">{{ channelName }}</div>
        <div><span class="channel-listitem-emotecount">{{ emoteCount }}</span> Emotes</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';
import TheSubheader from "./TheSubheader.vue";

export default defineComponent({
  name: "AdminChannelList",
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
    interface AdminChannelListResponse {
      channelList: Array<ChannelListItem>
    }

    const router = useRouter();

    const loading = ref(true);
    const error = ref(false);
    const state = reactive<State>({
      channelList: []
    });

    async function fetchData(): Promise<AdminChannelListResponse> {
      try {
        const URL = `http://localhost:8081/admin/getChannelList`;
        const token = localStorage.getItem("user");
        const response = await axios.get(URL, { headers: { authorization: token } }) as AxiosResponse;
        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    }

    onMounted(async () => {
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
      router.push(`/channel/${channelName}`)
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
  justify-content: space-evenly;
}

.channel-listitem {
  background-color: #EEE;
  text-align: center;
  font-size: 1.2em;
  font-variant: small-caps;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: rgb(241, 206, 117);
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