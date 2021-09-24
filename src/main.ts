import { createApp } from "vue";
import App from "@/App.vue";
import { store } from "./store/";
import router from "./router/";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUpload,
  faDownload,
  faRedo,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faCogs,
  faEdit,
  faCheck,
  faExpandAlt,
  faCompressAlt,
  faWindowClose,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";

import authConfig from "../auth_config.json";
import { setupAuth } from "./auth";
import { RouteLocationRaw } from "vue-router";

library.add(
  faUpload,
  faDownload,
  faRedo,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faCogs,
  faEdit,
  faCheck,
  faExpandAlt,
  faCompressAlt,
  faWindowClose,
  faLock,
  faLockOpen
);

require("./assets/sass/main.scss");

function callbackRedirect(appState: { targetUrl: RouteLocationRaw; }) {
  router.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : '/'
  );
}

const app = createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon);
  
app.config.performance = true;


setupAuth(authConfig, callbackRedirect).then((auth) => {
  app
  .use(store)
  // @ts-ignore
  .use(auth)
  .use(router)
  .mount('#app')
})