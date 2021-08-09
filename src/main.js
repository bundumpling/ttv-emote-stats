import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUpload, faChevronLeft, faChevronRight)


require('./assets/sass/main.scss');

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount('#app')
