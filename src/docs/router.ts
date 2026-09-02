import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import CustomizeView from './views/CustomizeView.vue';
import ExamplesView from './views/ExamplesView.vue';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { name: 'home', path: '/', component: HomeView },
        { name: 'examples', path: '/examples', component: ExamplesView },
        { name: 'customize', path: '/customize', component: CustomizeView },
    ],
});
