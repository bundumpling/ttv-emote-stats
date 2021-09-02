import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/HomePage.vue")
  },
  {
    path: "/Rankings",
    name: "Rankings",
    component: () => import("../pages/RankingsPage.vue")
  },
  {
    path: "/Settings",
    name: "Settings",
    component: () => import("../pages/SettingsPage.vue")
  },
  {
    path: "/channel/:channelName",
    name: "Channel",
    component: () => import("../pages/ChannelPage.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;