import { createRouter, createWebHistory } from "vue-router";
import Layout from "./shared/presentation/components/layout.vue";
import Auth from "./shared/presentation/components/auth.layout.vue";
import Login from "./userManagment/presentation/login.vue";
import Register from "./userManagment/presentation/register.vue";
import PageNotFound from "./shared/presentation/views/page-not-found.vue";
import Home from "./shared/presentation/views/home.vue";
import CustomerManagement from "./customer/presentation/views/customer-management.page.vue";
import PropertyManagement from "./property/presentation/property-management.vue";
const routes = [
    {
        path: "/auth",
        component: Auth,
        children: [
            { path: "register", name: "register", component: Register, meta: { title: "Register" } },
            { path: "login", name: "login", component: Login, meta: { title: "Login" } },
        ],
    },

    {
        path: "/",
        component: Layout,
        children: [
            { path: "", name: "home", component: Home, meta: { title: "Home" } },
            { path: "customer", name: "customer", component: CustomerManagement, meta: { title: "Customer" } },
            { path: "property", name: "property", component: PropertyManagement, meta: { title: "Property" } },


        ],
    },

    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: PageNotFound,
        meta: { title: "Page not found" },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const baseTitle = "Diabelife";
    document.title = `${baseTitle} - ${to.meta.title || ""}`;

    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated && !to.path.startsWith("/auth")) {
        return next("/auth/login");
    }

    next();
});

export default router;
