import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/views/Layout.vue";
import login from "@/views/Login.vue";
import Product from "@/views/Product/index.vue";
const params = () => import("@/views/Params/index.vue");
const content = () => import("@/views/Content/index.vue");
const search = () => import("@/views/Search/index.vue");
const register = () => import("@/views/Register.vue");
const routes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Product",
        component: Product,
        meta:{
          isLogin:true
        }
      },
      {
        path: "params",
        name: "params",
        component: params,
        meta:{
          isLogin:true
        }
      },
      {
        path: "content",
        name: "content",
        component: content,
        meta:{
          isLogin:true
        }
      },{
        path: "search",
        name: "search",
        component: search,
        meta:{
          isLogin:true
        }
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: login,
  },
  {
    path: "/register",
    name: "Register",
    component: register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
