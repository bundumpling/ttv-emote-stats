import { createApp, h } from 'vue'
import routes from './routes'

import NotFoundPage from './pages/NotFoundPage'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faDownload, faChevronLeft, faChevronRight, faChartBar, faCogs, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faUpload, faDownload, faChevronLeft, faChevronRight, faChartBar, faCogs, faEdit)

require('./assets/sass/main.scss');

const Router = {
  data: () => ({
    currentRoute: window.location.pathname
  }),
  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFoundPage
    }
  },
  render() {
    console.log(window.location.pathname)
    return h(this.CurrentComponent)
  }
}

createApp(Router).component("font-awesome-icon", FontAwesomeIcon).mount('#app')
