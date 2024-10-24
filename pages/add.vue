<script setup lang="ts">
const url = ref('');

const sending = ref(false);

const response = ref<
  | (
      | { success: true; message: string; key: string }
      | { success: false; message: string }
    )
  | null
>(null);

async function submit() {
  sending.value = true;
  response.value = null;

  try {
    const { key } = await $fetch('/api/books', {
      method: 'POST',
      body: {
        url: url.value
      }
    });

    response.value = {
      success: true,
      message: 'Book added!',
      key
    };
    url.value = '';
  } catch (e) {
    response.value = {
      success: false,
      message: 'Error'
    };
  }

  console.log(url.value);
  sending.value = false;
}
</script>

<template>
  <div>
    <h1 class="text-center text-2xl font-bold">Add a new book</h1>
    <div class="mt-6 flex flex-col gap-2">
      <form @submit.prevent="submit">
        <label
          for="search"
          class="sr-only mb-2 text-sm font-medium text-gray-900"
          >Search</label
        >
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
          >
            <svg
              class="h-4 w-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://www.thalia.de/shop/home/artikeldetails/A1069506874"
            required
            v-model="url"
          />
          <button
            type="submit"
            :disabled="url.length <= 5 || sending"
            class="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:hover:bg-blue-400"
          >
            Add
          </button>
        </div>
      </form>
      <div
        v-if="response"
        class="flex flex-col rounded-xl p-4"
        :class="response.success ? 'bg-green-400' : 'bg-red-400'"
      >
        {{ response.message }}
        <NuxtLink
          v-if="response.success"
          :to="`/books/${response.key}`"
          class="underline"
          >Open</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
