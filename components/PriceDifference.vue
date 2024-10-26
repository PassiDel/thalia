<script setup lang="ts">
import { formatDistance } from 'date-fns';
import { computed } from 'vue';
import { type BookInfluxData } from '../types/influx';
import { difference } from '../utils/price';

const props = defineProps<{
  data: {
    book: {
      lastPrice: number;
    };
    data?: BookInfluxData[];
  };
}>();

const first = computed(() => {
  if (
    !props.data.data ||
    props.data.data.length <= 0 ||
    props.data.data[0].data.length <= 0
  ) {
    return null;
  }
  return props.data.data[0].data[0];
});
const diff = computed(() =>
  first.value
    ? Math.floor(difference(props.data.book.lastPrice, first.value.y) * 100)
    : 0
);
</script>

<template>
  <span class="font-bold">{{
    props.data.book.lastPrice.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR'
    })
  }}</span
  ><span
    v-if="first && diff"
    :class="diff < 0 ? 'text-green-700' : 'text-red-700'"
  >
    ({{ diff < 0 ? `${diff} %` : `+${diff} %` }} since
    {{
      formatDistance(new Date(first.x), new Date(), { addSuffix: true })
    }})</span
  >
</template>

<style scoped></style>
