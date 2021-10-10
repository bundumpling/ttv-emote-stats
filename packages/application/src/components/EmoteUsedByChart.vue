<template>
  <highcharts class="chart" :options="usedByChartOptions"></highcharts>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { Chart } from "highcharts-vue";

export default defineComponent({
  name: "EmoteUsedByChart",
  components: {
    highcharts: Chart,
  },
  props: {
    emoteCode: {
      type: String,
      required: true,
    },
    usedBy: {
      type: Object as PropType<{ [key: string]: number }>,
      required: true,
    },
  },
  setup(props) {
    const chartifiedUsedByData = computed(() => {
      let result = [];
      const users = Object.keys(props.usedBy);
      const totalCount = users.reduce(
        (total, user) => total + props.usedBy[user],
        0
      );
      const sortedUsers = users.sort((a, b) => {
        return props.usedBy[b] - props.usedBy[a];
      });

      const maxIndividualUserPieSlices = 15;
      const numberOfTopUsers =
        users.length > maxIndividualUserPieSlices
          ? maxIndividualUserPieSlices
          : users.length;

      const notTopUserCount = users.length - numberOfTopUsers;
      let notTopUsageCount = totalCount;

      for (let i = 0; i < numberOfTopUsers; i++) {
        const user = sortedUsers[i];
        const username = user.split("-")[0];
        const count = props.usedBy[user];
        result.push({
          name: username,
          y: count,
        });
        notTopUsageCount -= count;
      }

      if (numberOfTopUsers < users.length) {
        result.push({
          name: `${notTopUserCount} other users`,
          y: notTopUsageCount,
        });
      }

      return result;
    });

    const usedByChartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        useHTML: true,
        text: `Usage by User`,
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: "Uses",
          colorByPoint: true,
          data: chartifiedUsedByData.value,
        },
      ],
    };

    return {
      usedByChartOptions,
    };
  },
});
</script>
