<script setup lang="ts">
const route = useRoute();

const { key } = route.params;

const { data } = await useFetch(`/api/books/${key}`);
</script>

<template>
  <div class="pb-6 pt-2">
    <div class="flex flex-col gap-4 md:flex-row">
      <img
        class="col-span-2 mx-auto w-[250px] rounded-xl shadow-lg transition-shadow hover:shadow-2xl md:m-4"
        v-if="data?.image"
        :src="data.image"
        :alt="data?.title || key"
        :title="data?.title || key"
      />
      <div class="mx-4 flex flex-col justify-center gap-2 md:mx-0">
        <h1 class="text-2xl">{{ data?.title || key }}</h1>
        <h2 class="text-xl">{{ data?.author || 'No author' }}</h2>
        <p>{{ data?.isbn }}</p>
        <p v-if="data && data.lastPrice">
          Price:
          <span class="font-bold">{{
            data?.lastPrice.toLocaleString('de-DE', {
              style: 'currency',
              currency: 'EUR'
            })
          }}</span>
        </p>
        <p v-else>Price: No price fetched yet!</p>
        <a class="underline" v-if="data?.url" :href="data.url" target="_blank"
          >On thalia.de</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
