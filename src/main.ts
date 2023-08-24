import { createApp, onMounted } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "./router/permission";
import "./assets/css/common.css";
//网络请求很多地方都会调用，所以最后挂到最外层
import api from "@/api";
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import useStore from "./store";
import { el } from "element-plus/es/locale/index.js";
const app = createApp(App);
app.config.globalProperties.$api = api;
const store = createPinia();
app.directive("focus", (el) =>
  onMounted(() => {
    console.log('success')
    console.log(el);
    el.focus();
  })
);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(store);
//做登录校验，检查之前是否登录过
useStore().loginStore.checkLogin();
app.mount("#app");
