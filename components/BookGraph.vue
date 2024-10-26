<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { type BookInfluxData } from '../types/influx';

ChartJS.register(
  Title,
  PointElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Colors
);

const props = defineProps<{
  data: BookInfluxData[] | null;
  hideLegend?: boolean;
}>();
const datasets = computed(() =>
  props.data
    ? {
        datasets: props.data.map((d) => ({
          label: d.title,
          data: d.data,
          fill: false,
          tension: 0.1
        }))
      }
    : { datasets: [] }
);
</script>

<template>
  <ClientOnly>
    <Line
      :options="{
        responsive: true,
        locale: 'de-DE',
        plugins: {
          legend: {
            display: !props.hideLegend
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR'
                })}`
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            adapters: {
              date: {
                locale: de
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price'
            }
          }
        }
      }"
      :data="datasets"
    />
  </ClientOnly>
</template>

<style scoped></style>
