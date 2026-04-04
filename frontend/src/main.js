import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/base.css'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
// Configuration de PrimeVue avec le thème Aura
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark', // Optionnel : pour gérer le mode sombre
        }
    }
})
app.use(ToastService)
app.mount('#app')
