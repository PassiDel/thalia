// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    redisPassword: '',
    redisHost: '127.0.0.1'
  },

  modules: ['@nuxtjs/tailwindcss']
});