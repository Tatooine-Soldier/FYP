import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as VueGoogleMaps from 'vuejs-google-maps';
import VueGeolocation from 'vue-browser-geolocation'

const app = createApp(App);
app.config.globalProperties.$globalUser = "0";
app.use(router).mount('#app');

app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyDTNOMjJP2zMMEHcGy2wMNae1JnHkGVvn0',
    },
    autobindAllEvents: true,
}).mount('#app')

app.use(VueGeolocation);



