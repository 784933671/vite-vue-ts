import { createApp } from "vue";
import App from "./App.vue";
import "virtual:svg-icons-register";
// 引入动画
import "animate.css";
// 引入全局样式
import "@/assets/scss/global.scss";
// 引入状态管理
import { setupStore } from "@/store";
// 路由
import { setupRouter } from "./router";
// 创建实例
const setupAll = async () => {
  const app = createApp(App);
  setupStore(app);
  setupRouter(app);
  app.mount("#app");
};
setupAll();
