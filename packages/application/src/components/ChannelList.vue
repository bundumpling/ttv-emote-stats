<template>
  <div class="w-full">
    <TheSubheader msg="Channel List" />
    <div v-if="onAdminPage">
      <button class="button is-medium is-link" @click="goToChannelCreation">
        Add Channel
      </button>
    </div>
    <ul class="m-2 flex content-center items-baseline flex-wrap justify-evenly">
      <li
        v-for="{ channelName, emoteCount, profileImageURL } in channelList"
        :key="channelName"
        class="
          group
          relative
          m-2
          bg-gray-50
          border-4 border-gray-300
          rounded-md
          w-36
          cursor-pointer
          hover:border-gray-800
        "
        @click="goToChannel(channelName)"
      >
        <div
          class="
            flex
            relative
            flex-wrap
            content-center
            group-hover:bg-yellow-100
          "
        >
          <div
            class="
              absolute
              z-10
              inset-0
              text-center
              flex flex-col
              items-center
              justify-start
              opacity-0
              group-hover:opacity-100
            "
          >
            <h3
              class="
                z-20
                w-full
                text-xl
                font-bold
                text-yellow-600
                tracking-wider
                group-hover:bg-gray-800
              "
            >
              {{ emoteCount }} Emotes
            </h3>
          </div>
          <img
            class="mx auto"
            :src="profileImageURL"
            :alt="`profile image for ${channelName}`"
          />
        </div>
        <div
          class="
            py-1
            text-center
            tracking-wide
            font-bold
            text-xl
            border-t-4
            group-hover:text-dark-300
            group-hover:border-gray-800
            group-hover:bg-yellow-100
          "
        >
          {{ channelName }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeMount, computed } from "vue";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import TheSubheader from "./TheSubheader.vue";

export default defineComponent({
  name: "ChannelList",
  components: {
    TheSubheader,
  },
  props: {
    onAdminPage: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
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

    const router = useRouter();
    const loading = ref(true);
    const error = ref(false);
    const state = reactive<State>({
      channelList: [],
    });
    const channelList = computed(() => state.channelList);

    async function fetchData(): Promise<ChannelListResponse> {
      try {
        const URL = `http://localhost:8081/channelList`;
        const response = (await axios.get(
          URL
        )) as AxiosResponse<ChannelListResponse>;
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
      if (props.onAdminPage) {
        router.push(`/admin/channel/${channelName}`);
      } else {
        router.push(`/channel/${channelName}`);
      }
    }

    function goToChannelCreation() {
      if (props.onAdminPage) {
        router.push("/admin/add-channel");
      } else {
        router.push("/login");
      }
    }

    return {
      channelList,
      goToChannel,
      goToChannelCreation,
      loading,
      error,
    };
  },
});
</script>
