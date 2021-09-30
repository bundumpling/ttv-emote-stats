import { createWebHistory, createRouter, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

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
    path: "/admin/:channelName/update-emotes",
    name: "UpdateEmotes",
    component: () => import("../pages/UpdateEmotesPage.vue"),
    beforeEnter: beforeEnterRouteWithChannelName,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin/:channelName/parse-logs",
    name: "ParseLogs",
    component: () => (import("../pages/ParseLogsPage.vue")),
    beforeEnter: beforeEnterRouteWithChannelName,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin/:channelName",
    name: "ManageChannel",
    component: () => import("../pages/ManagePage.vue"),
    beforeEnter: beforeEnterRouteWithChannelName,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("../pages/LoginPage.vue")
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import("../pages/AdminPage.vue"),
    meta: {
      requiresAuth: true
    }
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

router.beforeEach((to, from, next) => {
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