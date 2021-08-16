import { createWebHistory, createRouter } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("./pages/HomePage.vue")
  },
  {
    path: "/Rankings",
    name: "Rankings",
    component: () => import("./pages/RankingsPage.vue")
  },
  {
    path: "/Settings",
    name: "Settings",
    component: () => import("./pages/SettingsPage.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;