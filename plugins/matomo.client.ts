// @ts-expect-error
import VueMatomo from 'vue-matomo';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMatomo, {
    host: 'https://analytics.syma.dev',
    siteId: 11,
    router: nuxtApp.$router,
    trackInitialView: true
  });
});
