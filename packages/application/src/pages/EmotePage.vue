<template>
  <div v-if="ready">
    <div class="header">
      Usage of <img :src="emoteImage" :alt="emoteCode" /> in <b>{{ channelName }}</b>'s Channel
    </div>
    <UsedOnChart :emote-code="emoteCode" :used-on="usedOn" />
    <UsedByChart :emote-code="emoteCode" :used-by="usedBy" />
  </div>
  <div v-else-if="error" class="error">Error retrieving emote data.</div>
  <div v-else class="loading">Loading...</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeMount, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import UsedByChart from "../components/EmoteUsedByChart.vue";
import UsedOnChart from "../components/EmoteUsedOnChart.vue";

export default defineComponent({
  name: 'EmotePage',
  components: {
    UsedByChart,
    UsedOnChart
  },
  setup() {
    const route = useRoute();

    const emoteID = Array.isArray(route.params.emoteID) ? route.params.emoteID.join() : route.params.emoteID;
    const emoteCode = emoteID.split('-')[1];

    const ready = ref(false);
    const error = ref(false);

    interface State {
      channelName: string | null,
      count: number,
      image: string | null,
      usedOn: {
        [key: string] : number
      },
      usedBy: {
        [key: string] : number
      }
    }

    const state = reactive<State>({
      channelName: null,
      count: 0,
      image: null,
      usedOn: {},
      usedBy: {}
    })

    interface Response {
      _id: string,
      channelID: string,
      channelName: string,
      code: string,
      count: number,
      image: string,
      obsolete: boolean,
      provider: string,
      providerID: string,
      usedBy: {
        [key: string]: number
      },
      usedOn: {
        [key: string]: number
      },
      error?: string
    }

    async function fetchData(): Promise<Response> {
      try {
        const URL = `http://localhost:8081/emote/${emoteID}/usageDetails`;
        const response = await axios.get(URL);
        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    }

    onBeforeMount(async () => {
      try {
        const emoteData = await fetchData();
        if (emoteData.error) throw new Error(emoteData.error)
        state.channelName = emoteData.channelName;
        state.count = emoteData.count;
        state.image = emoteData.image;
        state.usedOn = emoteData.usedOn;
        state.usedBy = emoteData.usedBy;
        ready.value = true;
      } catch (err) {
        error.value = true;
      }
    })

    const channelName = computed(() => state.channelName)
    const emoteImage = computed(() => state.image)
    const usedOn = computed(() => state.usedOn)
    const usedBy = computed(() => state.usedBy)

    return {
      ready,
      error,
      emoteImage,
      emoteCode,
      usedOn,
      usedBy,
      channelName
    }
  }
})
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@500&display=swap");
.header {
  font-family: "Inconsolata", monospace;
  padding-bottom: 0.75em;
  font-size: 2.2em;
  font-weight: 500;
  text-align: center;
}
</style>