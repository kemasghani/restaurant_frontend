import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import 'primeicons/primeicons.css';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(ToastService)
app.use(createPinia())
app.use(router)

app.use(ConfirmationService)
app.component('Toast', Toast)
app.directive('tooltip', Tooltip);

app.mount('#app')
