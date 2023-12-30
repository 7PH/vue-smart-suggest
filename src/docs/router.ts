import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ name: 'home', path: '/', component: HomeView }],
});
