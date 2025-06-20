import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import CountryShowByName from '@/views/countries_api/CountryShowByName.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/country/show-by-name',
      name: 'country-show-by-name',
      component: CountryShowByName,
    },
  ],
});

export default router;
