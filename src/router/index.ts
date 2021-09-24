import { createWebHistory, createRouter, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

import { routeGuard } from '../auth';

const validateChannelName = (channelName: string | string[]) =>
  (/^[a-zA-Z0-9_]{4,25}$/.test(Array.isArray(channelName) ? channelName.join() : channelName))

const validateEmoteID = (emoteID: string | string[]) => 
  (/^\d+-[a-zA-Z0-9]+$/.test(Array.isArray(emoteID) ? emoteID.join() : emoteID))

const beforeEnterRouteWithChannelName = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (validateChannelName(to.params.channelName)) {
    next()
  } else {
    next({ name: "NotFound" });
  }
};

const beforeEnterRouteWithEmoteID = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (validateEmoteID(to.params.emoteID)) {
    next()
  } else {
    next({ name: "NotFound" })
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/HomePage.vue")
  },
  {
    path: "/channel/:channelName/manage/update-emotes",
    name: "UpdateEmotes",
    component: () => import("../pages/UpdateEmotesPage.vue"),
    beforeEnter: routeGuard
  },
  {
    path: "/channel/:channelName/manage/parse-logs",
    name: "ParseLogs",
    component: () => (import("../pages/ParseLogsPage.vue")),
    beforeEnter: routeGuard
  },
  {
    path: "/channel/:channelName/manage",
    name: "ManageChannel",
    component: () => import("../pages/ManagePage.vue"),
    beforeEnter: routeGuard
  },
  {
    path: "/channel/:channelName",
    name: "Channel",
    component: () => import("../pages/ChannelPage.vue"),
    beforeEnter: beforeEnterRouteWithChannelName
  },
  {
    path: "/emote/:emoteID",
    name: "Emote",
    component: () => import("../pages/EmotePage.vue"),
    beforeEnter: beforeEnterRouteWithEmoteID
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import("../pages/Callback.vue")
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import("../pages/ErrorPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/NotFoundPage.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;