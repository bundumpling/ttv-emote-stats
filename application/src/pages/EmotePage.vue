<template>
  <div v-if="ready">
    <div class="header">
      Usage of <img :src="emoteImage" :alt="emoteCode" /> in <b>{{ channelName }}</b>'s Channel
    </div>
    <highcharts class="chart" :options="usedOnChartOptions"></highcharts>
    <highcharts class="chart" :options="usedByChartOptions"></highcharts>
  </div>
  <div v-else-if="error" class="error">Error retrieving emote data.</div>
  <div v-else class="loading">Loading...</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { Chart } from 'highcharts-vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'EmotePage',
  components: {
    highcharts: Chart
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

    onMounted(async () => {
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

    const usedOnChartOptions = computed(() => ready.value ? ({
      chart: {
        //type: 'bar'
      },
      title: {
        useHTML: true,
        text: `Usage by Date`
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        },
      },
      yAxis: {
        title: {
          text: '# of Uses'
        }
      },
      series: [{
        name: emoteCode,
        data: Object.keys(state.usedOn).map(date => {
          const year = Number(String(date).slice(0, 4));
          const month = Number(String(date).slice(4, 6)) - 1;
          const day = Number(String(date).slice(6));
          const dateTime = new Date(year, month, day).getTime();
          return [ dateTime, state.usedOn[date] ]
        }).sort((a, b) => b[0] - a[0])
      }]
    }): {})

    const chartifiedUsedByData = computed(() => {
      let result = [];
      const users = Object.keys(state.usedBy);
      const sortedUsers = users.sort(
        (a, b) => {
          return state.usedBy[b] - state.usedBy[a]
        }
      );

      const maxIndividualUserPieSlices = 15;
      const numberOfTopUsers = users.length > maxIndividualUserPieSlices ? maxIndividualUserPieSlices : users.length;

      const notTopUserCount = users.length - numberOfTopUsers;
      let notTopUsageCount = state.count;

      for (let i = 0; i < numberOfTopUsers; i++) {
        const user = sortedUsers[i];
        const username = user.split('-')[0];
        const count = state.usedBy[user];
        result.push({
          name: username,
          y: count
        })
        notTopUsageCount -= count;
      }

      if (numberOfTopUsers < users.length) {
        result.push({
          name: `${notTopUserCount} other users`,
          y: notTopUsageCount
        })
      }

      return result;
    })


    const usedByChartOptions = computed(() => ready.value ? {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        useHTML: true,
        text: `Usage by User`
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
          }
      },
      series: [{
        name: 'Uses',
        colorByPoint: true,
        data: chartifiedUsedByData.value
      }]
    }: {})

    return {
      ready,
      error,
      emoteImage,
      emoteCode,
      channelName,
      usedOnChartOptions,
      usedByChartOptions
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