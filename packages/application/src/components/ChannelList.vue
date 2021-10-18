<template>
  <div class="container">
    <TheSubheader msg="Channel List" />
    <router-link v-if="isAdminPage" to="/admin/add-channel">
      <button class="button is-medium is-link">Add Channel</button>
    </router-link>
    <ul class="channel-list">
      <li
        v-for="(
          { channelName, emoteCount, profileImageURL }
        ) in channelList"
        :key="channelName"
        class="channel-listitem"
        @click="goToChannel(channelName)"
      >
        <div class="channel-listitem-pfp">
          <img
            :src="profileImageURL"
            :alt="`profile image for ${channelName}`"
          />
        </div>
        <div class="channel-listitem-name">{{ channelName }}</div>
        <div>
          <span class="channel-listitem-emotecount">{{ emoteCount }}</span>
          Emotes
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeMount, computed } from "vue";
import axios, { AxiosResponse } from "axios";
import { useRoute, useRouter } from "vue-router";
import TheSubheader from "./TheSubheader.vue";

export default defineComponent({
  name: "ChannelList",
  components: {
    TheSubheader,
  },
  setup() {
    interface ChannelListItem {
      channelName: string;
      emoteCount: number;
      profileImageURL: string;
    }
    interface State {
      channelList: Array<ChannelListItem>;
    }
    interface ChannelListResponse {
      channelList: Array<ChannelListItem>;
    }

    const route = useRoute();
    const router = useRouter();

    const path = computed(() => route.path);
    const isAdminPage = path.value.startsWith("/admin");

    const loading = ref(true);
    const error = ref(false);
    const state = reactive<State>({
      channelList: [],
    });
    const channelList = computed(() => state.channelList);

    async function fetchData(): Promise<ChannelListResponse> {
      try {
        const URL = `http://localhost:8081/channelList`;
        const response = (await axios.get(URL)) as AxiosResponse<ChannelListResponse>;
        return response.data;
      } catch (err) {
        throw new Error("Error retrieving channel list.");
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
    });

    function goToChannel(channelName: string) {
      if (isAdminPage) {
        router.push(`/admin/${channelName}`);
      } else {
        router.push(`/channel/${channelName}`);
      }
    }

    return {
      channelList,
      goToChannel,
      isAdminPage,
      loading,
      error,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin: 8px;
  background-color: #eee;
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