import { createWebHistory, createRouter, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

const baseTitle = import.meta.env.VITE_APP_BASE_TITLE;

const validateChannelName = (channelName: string | string[]) =>
  (/^[a-zA-Z0-9_]{4,25}$/.test(Array.isArray(channelName) ? channelName.join() : channelName))

const validateEmoteID = (emoteID: string | string[]) => 
  (/^\d+-[a-zA-Z0-9]+$/.test(Array.isArray(emoteID) ? emoteID.join() : emoteID))

const beforeEnterRouteWithChannelName = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (validateChannelName(to.params.channelName)) {
    document.title = `${baseTitle} | ${to.params.channelName} | ${String(to.name)}`
    next()
  } else {
    next({ name: "NotFound" });
  }
};

const beforeEnterRouteWithEmoteID = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (validateEmoteID(to.params.emoteID)) {
    document.title = `${baseTitle} | Emote | ${String(to.params.emoteID).split("-")[1]}`;
    next()
  } else {
    next({ name: "NotFound" })
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/HomePage.vue"),
    meta: {
      setTitle: true
    }
  },
  {
    path: "/channel/:channelName",
    name: "Channel Stats",
    component: () => import("../pages/ChannelPage.vue"),
    meta: {
      title: import.meta.env.VITE_APP_BASE_TITLE 
    },
    beforeEnter: beforeEnterRouteWithChannelName
  },
  {
    path: "/emote/:emoteID",
    name: "Emote",
    component: () => import("../pages/EmotePage.vue"),
    beforeEnter: beforeEnterRouteWithEmoteID
  },
  {
    path: "/admin/:channelName/update-emotes",
    name: "Update Emotes",
    component: () => import("../pages/UpdateEmotesPage.vue"),
    beforeEnter: beforeEnterRouteWithChannelName,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin/:channelName/parse-logs",
    name: "Parse Logs",
    component: () => (import("../pages/ParseLogsPage.vue")),
    beforeEnter: beforeEnterRouteWithChannelName,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin/:channelName",
    name: "Manage",
    component: () => import("../pages/ManagePage.vue"),
    beforeEnter: beforeEnterRouteWithChannelName,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("../pages/LoginPage.vue"),
    meta: {
      setTitle: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import("../pages/AdminPage.vue"),
    meta: {
      requiresAuth: true,
      setTitle: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/NotFoundPage.vue"),
    meta: {
      setTitle: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.setTitle) {
    document.title = `${baseTitle} | ${String(to.name)}`
  }
  if (to.name === from.name) {
    return next();
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("user") == null) {
      next({
        path: "/login"
      })
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router;