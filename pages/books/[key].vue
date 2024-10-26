<script setup lang="ts">
import BookGraph from '../../components/BookGraph.vue';

const route = useRoute();

const { key } = route.params;

const { data } = await useFetch(`/api/books/${key}`);
</script>

<template>
  <div class="pb-6 pt-2">
    <div class="flex flex-col gap-4 md:flex-row">
      <img
        class="col-span-2 mx-auto w-[250px] rounded-xl shadow-lg transition-shadow hover:shadow-2xl md:m-4"
        v-if="data?.book?.image"
        :src="data.book.image"
        :alt="data?.book?.title || key"
        :title="data?.book?.title || key"
      />
      <div class="mx-4 flex flex-col justify-center gap-2 md:mx-0">
        <h1 class="text-2xl">{{ data?.book?.title || key }}</h1>
        <h2 class="text-xl">{{ data?.book?.author || 'No author' }}</h2>
        <p>{{ data?.book?.isbn }}</p>
        <p v-if="data && data.book.lastPrice">
          Price:
          <PriceDifference :data="data" />
        </p>
        <p v-else>Price: No price fetched yet!</p>
        <a
          class="underline"
          v-if="data?.book?.url"
          :href="data.book.url"
          target="_blank"
          >On thalia.de</a
        >
      </div>
    </div>
    <BookGraph :data="data?.data" />
  </div>
</template>

<style scoped></style>
