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
          path: '/show-by-name',
          name: 'country-show-by-name',
          component: CountryShowByName,
        },
      ],
    },
  ],
});

export default router;
