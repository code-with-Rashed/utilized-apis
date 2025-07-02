import { createRouter, createWebHistory } from 'vue-router';
import CountryShowByName from '@/views/countries_api/CountryShowByName.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'country-show-by-name' },
    },
    {
      path: '/country',
      children: [
        {
          path: 'show-by-name',
          name: 'country-show-by-name',
          component: CountryShowByName,
          meta: { title: 'Show country information.' },
        },
        {
          path: 'show-by-world-regions',
          name: 'country-show-by-world-regions',
          component: () => import('@/views/countries_api/CountryShowByWorldRegions.vue'),
          meta: { title: 'Show world regions countries.' },
        },
      ],
    },
    {
      path: '/show-random-and-customize-image',
      name: 'show-random-and-customize-image',
      component: () => import('@/views/picsum_api/ShowRandomAndCustomizeImage.vue'),
      meta: { title: 'Show random and customize image' },
    },
  ],
});

export default router;
