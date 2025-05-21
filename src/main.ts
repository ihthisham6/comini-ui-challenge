// In main.ts or main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faArrowLeft, 
  faPlay, 
  faUser, 
  faBookmark, 
  faHome, 
  faSearch, 
  faBell,
  faTimes,
  faPause,
  faEllipsisV,
  faFaceSadTear,
  faFaceMeh,
  faFaceSmile
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faArrowLeft, 
  faPlay, 
  faUser, 
  faBookmark, 
  faHome, 
  faSearch, 
  faBell,
  faTimes,
  faPause,
  faEllipsisV,
  faFaceSadTear,
  faFaceMeh,
  faFaceSmile
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')