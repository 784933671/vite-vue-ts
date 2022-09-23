import type { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { components } from "./asyncRouter";
const Components: IObject<() => Promise<typeof import("*.vue")>> =
  Object.assign({}, components, {
    Layout: (() => import("@/layout/index.vue")) as unknown as () => Promise<
      typeof import("*.vue")
    >,
  });

// 静态路由页面
export const allowRouter: Array<IMenubarList> = [
  {
    name: "Login",
    path: "/login",
    component: Components["LoginIndex"],
    meta: { title: "登录" },
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL.replace(/\./g, "")),
  routes: allowRouter as RouteRecordRaw[],
});

router.beforeEach(async (to, from) => {
  if (to.path.toLocaleLowerCase() === "/login".toLocaleLowerCase()) {
    return true;
  }
  //获取token
  const token = localStorage.getItem("token");
  if (!token) {
    router.replace("/login");
    return false;
  }
});

router.afterEach(() => {});
//页面刷新时调用
router
  .isReady()
  .then((res) => {})
  .catch((err) => {});

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;
