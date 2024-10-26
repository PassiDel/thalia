<script setup>
import BookGraph from '../components/BookGraph.vue';

const { data, refresh, status } = await useFetch(`/api/books`, {
  lazy: true
});
const { data: bookData } = await useFetch(`/api/books/data`, {
  lazy: true
});
</script>

<template>
  <div>
    <h1 class="text-center text-2xl font-bold">
      Thalia History
      <button
        class="group rounded-xl bg-gray-100 px-2 py-1 shadow transition hover:shadow-lg active:shadow-md disabled:cursor-progress disabled:bg-gray-300 disabled:shadow"
        :disabled="status === 'pending'"
        @click="refresh"
      >
        <span class="inline-block group-disabled:animate-spin">⟳</span>
      </button>
    </h1>
    <BookGraph :data="bookData" hide-legend />
    <div class="mt-4 flex flex-col gap-4" v-if="data">
      <NuxtLink
        v-for="book in data.books"
        :key="book.key"
        :to="`/books/${book.key}`"
        class="flex flex-row justify-between rounded bg-gray-300 p-2 shadow transition-shadow hover:shadow-lg"
      >
        <span
          ><span class="italic">{{ book.title }}</span> by
          {{ book.author }}</span
        >
        <span v-if="book.lastPrice">{{
          book.lastPrice.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR'
          })
        }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
