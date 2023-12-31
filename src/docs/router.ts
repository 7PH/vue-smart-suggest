import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import CustomizeView from './views/CustomizeView.vue';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { name: 'home', path: '/', component: HomeView },
        { name: 'customize', path: '/customize', component: CustomizeView },
    ],
});
