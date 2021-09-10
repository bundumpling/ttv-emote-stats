import { createWebHistory, createRouter, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';


const validateChannelName = (channelName: string | string[]) =>
  (/^[a-zA-Z0-9_]{4,25}$/.test(Array.isArray(channelName) ? channelName.join() : channelName))


const beforeEnterRouteWithChannelName = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (validateChannelName(to.params.channelName)) {
    next()
  } else {
    next({ name: "NotFound" });
  }
};

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
    path: "/channel/:channelName/settings",
    name: "ChannelSettings",
    component: () => import("../pages/SettingsPage.vue"),
    beforeEnter: beforeEnterRouteWithChannelName
  },
  {
    path: "/channel/:channelName",
    name: "Channel",
    component: () => import("../pages/ChannelPage.vue"),
    beforeEnter: beforeEnterRouteWithChannelName
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/NotFoundPage.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;