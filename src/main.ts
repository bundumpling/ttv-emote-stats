import { createApp } from 'vue'
import { store } from './store/'
import App from "@/App.vue"
import router from './router/'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faDownload, faRedo, faChevronLeft, faChevronRight, faChartBar, faCogs, faEdit, faCheck, faExpandAlt, faCompressAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faUpload, faDownload, faRedo, faChevronLeft, faChevronRight, faChartBar, faCogs, faEdit, faCheck, faExpandAlt, faCompressAlt, faWindowClose)

require('./assets/sass/main.scss');

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(router).use(store);
app.mount('#app')
