<template>
  <highcharts class="chart" :options="usedOnChartOptions"></highcharts>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { Chart } from 'highcharts-vue'

export default defineComponent({
  name: "EmoteUsedOnChart",
  components: {
    highcharts: Chart
  },
  props: {
    emoteCode: {
      type: String,
      required: true
    },
    usedOn: {
      type: Object as PropType<{ [key: string]: number }>,
      required: true
    }
  },
  setup(props) {
    const usedOnChartOptions = computed(() => ({
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
        name: props.emoteCode,
        data: Object.keys(props.usedOn).map(date => {
          const year = Number(String(date).slice(0, 4));
          const month = Number(String(date).slice(4, 6)) - 1;
          const day = Number(String(date).slice(6));
          const dateTime = new Date(year, month, day).getTime();
          return [ dateTime, props.usedOn[date] ]
        }).sort((a, b) => b[0] - a[0])
      }]
    }))

    return {
      usedOnChartOptions
    }
  }
})
</script>