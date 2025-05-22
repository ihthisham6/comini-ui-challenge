import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import global styles
import './style.css'

// Create and mount the Vue application
const app = createApp(App)

// Use the router
app.use(router)

// Mount the app
app.mount('#app') 