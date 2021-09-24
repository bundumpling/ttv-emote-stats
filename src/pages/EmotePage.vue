<template>
  <highcharts class="hc" :options="chartOptions"></highcharts>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { Chart } from 'highcharts-vue';
import { Axis, AxisLabelsFormatterContextObject, dateFormat } from "highcharts";
import { useStore } from '../store';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'EmotePage',
  components: {
    highcharts: Chart
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    onMounted(() => {
      store.dispatch("fetchEmoteUsageDetailsForEmotePage", route.params.emoteID);
    });

    const emoteData = computed(() => store.state.emote || null)
    const chartOptions = computed(() => emoteData.value ? ({
      chart: {
        //type: 'bar'
      },
      title: {
        useHTML: true,
        text: `Usage of <img src="${emoteData.value.image}" alt="${emoteData.value.code}" /> in <b>${emoteData.value.channelName}</b>'s Channel`
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
        name: emoteData.value.code,
        data: Object.keys(emoteData.value.usedOn).map(date => {
          const year = Number(String(date).slice(0, 4));
          const month = Number(String(date).slice(4, 6)) - 1;
          const day = Number(String(date).slice(6));
          const dateTime = new Date(year, month, day).getTime();
          return [ dateTime, emoteData.value.usedOn[date] ]
        }).sort((a, b) => b[0] - a[0])
      }]
    }): {})

    return {
      emoteData,
      chartOptions
    }
  }
})
</script>