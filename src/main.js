import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'
import { setRandomBackground } from './utils/background'

// 设置随机背景
setRandomBackground()

const app = createApp(App)
app.use(router)
app.mount('#app') 