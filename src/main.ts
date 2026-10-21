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
// 直接 patch ResizeObserver，吞掉 "loop completed with undelivered notifications" 错误
const OriginalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class extends OriginalResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super((entries, observer) => {
      requestAnimationFrame(() => {
        try {
          callback(entries, observer);
        } catch (e) {
          // 吞掉 ResizeObserver loop 错误
        }
      });
    });
  }
} as any;

createApp(App).use(ArcoVue).use(store).use(router).mount("#app");
