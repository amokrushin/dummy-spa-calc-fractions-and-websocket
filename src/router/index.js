import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../containers/Layout.vue';

Vue.use(VueRouter);

function load(component) {
    return () => import(`../containers/${component}.vue`);
}

const router = new VueRouter({
    base: '/',
    mode: 'hash',
    saveScrollPosition: true,
    linkActiveClass: 'active',
    routes: [
        {
            path: '',
            component: Layout,
            children: [
                {
                    path: '',
                    component: load('Home'),
                },
                {
                    path: 'calculator',
                    component: load('Calculator'),
                },
                {
                    path: 'websocket',
                    component: load('Websocket'),
                },
            ],
        },
        {
            path: '*',
            component: load('Error404'),
        },
    ],
});

export default router;
