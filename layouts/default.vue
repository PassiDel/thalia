<template>
  <div>
    <header
      class="flex h-[60px] flex-row items-center justify-between bg-gray-900 px-5 py-4 text-white"
    >
      <NuxtLink to="/" class="hover:underline">ThaliaHistory</NuxtLink>
      <NuxtLink to="/add" class="hover:underline">Add new book</NuxtLink>
    </header>
    <main class="h-[calc(100dvh_-_60px)] overflow-y-auto">
      <div
        class="mx-2 rounded-b-2xl bg-gray-200 p-4 pb-10 md:mx-auto md:w-2/3 lg:w-2/4"
      >
        <slot></slot>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts"></script>
