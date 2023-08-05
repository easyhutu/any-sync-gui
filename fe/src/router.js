import indexPage from './page/index.vue'
import settingPage from './page/setting.vue'
import VueRouter from "vue-router";

const routes = [
    {
        path: '/',
        component: indexPage
    },
    {
        path: '/setting',
        component: settingPage
    }
]


const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

export default router