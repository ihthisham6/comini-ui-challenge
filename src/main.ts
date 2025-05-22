import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import FontAwesome from './fontawesome'

// Import global styles
import './style.css'

// Create and mount the Vue application
const app = createApp(App)

// Use the router and FontAwesome
app.use(router)
app.use(FontAwesome)

// Mount the app
app.mount('#app') 