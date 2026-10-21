import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import router from "./router";
import store from "./store";
import "@/plugins/axios";
import "@/access";
import "bytemd/dist/index.css";

// 修复 Arco Design Vue 的 ResizeObserver 已知 bug
// 该错误会导致 Vue 应用崩溃，导航栏消失
const resizeObserverErrHandler = (e: ErrorEvent) => {
  if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
};
window.addEventListener("error", resizeObserverErrHandler, true);

createApp(App).use(ArcoVue).use(store).use(router).mount("#app");
