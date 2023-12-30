import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'highlight.js/styles/tokyo-night-dark.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import shell from 'highlight.js/lib/languages/shell';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import './style.css';
import { loadIcons } from './icons';
import App from './App.vue';
import { router } from './router';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('shell', shell);

loadIcons();

createApp(App)
    .use(router)
    .component('fa', FontAwesomeIcon)
    .use(hljsVuePlugin)
    .mount('#app');
