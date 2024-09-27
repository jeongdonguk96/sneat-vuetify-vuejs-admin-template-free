import { createRouter, createWebHistory } from 'vue-router'
import { logPageAccess } from '../stores/common/access';
import { routes } from './routes'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})


router.beforeEach((to, from, next) => {
    if (from.path !== '/') {
        window.location.href = to.fullPath
    } else {
        next()
    }
})


router.afterEach((to, from) => {
    if (from.path !== '/') {
        logPageAccess(to);
    } else {
        logPageAccess(to);
    }
})


export default function (app) {
    app.use(router)
}


export { router }
