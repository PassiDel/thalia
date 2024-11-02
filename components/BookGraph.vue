<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  LineElement,
  type Plugin,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
// noinspection ES6UnusedImports
import { de } from 'date-fns/locale';
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { type BookInfluxData } from '../types/influx';

const horizontalLinePlugin: Plugin<'line'> = {
  id: 'horizontalLine',
  afterDraw: (chart) => {
    const yValue = chart.scales.y.getPixelForValue(0);
    const ctx = chart.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(chart.chartArea.left, yValue);
    ctx.lineTo(chart.chartArea.right, yValue);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
};

ChartJS.register(
  Title,
  PointElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Colors,
  horizontalLinePlugin
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
          key: d.key,
          fill: false,
          tension: 0.1,
          stepped: true
        }))
      }
    : { datasets: [] }
);

const router = useRouter();
</script>

<template>
  <ClientOnly>
    <Line
      :options="{
        responsive: true,
        locale: 'de-DE',
        onClick(e) {
          const bar = this.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            true
          )[0];
          if (!bar || !this.data?.datasets[bar.datasetIndex]) {
            return;
          }
          const [_, key] = this.data?.datasets[bar.datasetIndex].key.split(':');
          router.push(`/books/${key}`);
        },
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
              unit: 'day',
              tooltipFormat: 'dd.MM.yyyy HH:mm:ss'
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
            },
            ticks: {
              callback(value) {
                return value.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR'
                });
              }
            }
          }
        }
      }"
      :data="datasets"
    />
  </ClientOnly>
</template>

<style scoped></style>
