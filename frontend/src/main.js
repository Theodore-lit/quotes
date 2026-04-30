import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/base.css'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { definePreset } from '@primeuix/themes'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

const MyAmberTheme = definePreset(Aura, {
  semantic: {
    primary : {
      50: '{amber.50}',
            100: '{amber.100}',
            200: '{amber.200}',
            300: '{amber.300}',
            400: '{amber.400}',
            500: '{amber.500}',
            600: '{amber.600}',
            700: '{amber.700}',
            800: '{amber.800}',
            900: '{amber.900}',
            950: '{amber.950}'
    }
  }
})
// Configuration de PrimeVue avec le thème Aura
app.use(PrimeVue, {
  theme: {
    preset: MyAmberTheme,
    options: {
      darkModeSelector: '.my-app-dark', // Optionnel : pour gérer le mode sombre
    },
  },
})

app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
})
app.use(ToastService)
app.mount('#app')
