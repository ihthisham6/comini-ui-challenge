import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faTimes, 
  faPause, 
  faEllipsisV, 
  faBars, 
  faSearch, 
  faFilter,
  faArrowLeft,
  faPlay,
  faHome,
  faBell,
  faUser,
  faBookmark,
  faCheck,
  faCircleCheck,
  faFaceSadTear,
  faFaceMeh,
  faFaceSmile
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { App } from 'vue'

// Add all icons to the library
library.add(
  faTimes, 
  faPause, 
  faEllipsisV, 
  faBars, 
  faSearch, 
  faFilter,
  faArrowLeft,
  faPlay,
  faHome,
  faBell,
  faUser,
  faBookmark,
  faCheck,
  faCircleCheck,
  faFaceSadTear,
  faFaceMeh,
  faFaceSmile
)

export default {
  install: (app: App) => {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
  }
} 