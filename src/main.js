import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

createApp(App).use(router).mount('#app');
