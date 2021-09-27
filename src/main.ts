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
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

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
  faLockOpen,
  faSpinner
);

require("./assets/sass/main.scss");


const app = createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon);
  
app.config.performance = true;

app
.use(store)
.use(router)
.mount('#app')