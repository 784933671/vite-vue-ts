import type { App } from "vue";
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  isNavigationFailure,
  NavigationFailureType,
  START_LOCATION,
} from "vue-router";
import { components, generatorDynamicRouter } from "./asyncRouter";
import { axiosPromiseStore } from "@/store/modules/axiosPromise";
import { useMenuStore } from "@/store/modules/menu";
import { removeLocalStorageList } from "@/utils/tools";
const Components: IObject<() => Promise<typeof import("*.vue")>> =
  Object.assign({}, components);

// 静态路由页面
export const allowRouter: Array<IMenubarList> = [
  {
    name: "Login",
    path: "/login",
    component: Components["LoginIndex"],
    meta: { title: "登录" },
  },
  {
    name: "Layout",
    path: "/",
    redirect: "/product/index",
    component: Components["Layout"],
    meta: { title: "首页", icon: "el-icon-eleme" },
    children: [
      {
        name: "404",
        path: "404",
        component: Components["Error404"],
        meta: { title: "404" },
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL.replace(/\./g, "")),
  routes: allowRouter as RouteRecordRaw[],
});
//是否动态添加路由标识
let registerRouteFresh = $ref(true);

//删除动态添加的路由
const removeAllRoute = async (): Promise<void> => {
  registerRouteFresh = true;
  const menuStore = useMenuStore();
  for (let item of menuStore.getMenuList) {
    router.removeRoute(item.name);
  }
  menuStore.$reset();
};

router.beforeEach(async (to, from) => {
  if (from === START_LOCATION) {
    // 初始导航
  }
  //跳转页面清除上个页面的所有未完成的请求并清空store pinia
  const useAxiosPromiseStore = axiosPromiseStore();
  useAxiosPromiseStore.clearAllAxiosPromisCancel();
  //登录页面直接放行并删除动态添加的路由为避免再次登录时重复添加
  if (to.path.toLocaleLowerCase() === "/login".toLocaleLowerCase()) {
    await removeAllRoute();
    await removeLocalStorageList(["token", "userInfo"]);
    return true;
  }
  //获取token并检测token是否存在 不存在则跳转登陆页面  存在则继续执行下面动态添加菜单逻辑
  const token = localStorage.getItem("token");
  if (!token) {
    //删除动态添加的路由为避免再次登录时重复添加
    await removeAllRoute();
    await removeLocalStorageList(["token", "userInfo"]);
    router.replace("/login");
    return false;
  }
  //动态添加路由
  if (registerRouteFresh) {
    const menuStore = useMenuStore();
    for (let item of generatorDynamicRouter(menuStore.getMenuList)) {
      router.addRoute(item as RouteRecordRaw);
    }
    registerRouteFresh = false;
    return to.fullPath;
  }
});
router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    console.log("重复导航是指在启动时已经在同一位置失败的导航");
  } else if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    console.log("终止导航", to.fullPath);
  }
});
//页面刷新时调用
router
  .isReady()
  .then((res) => {})
  .catch((err) => {});

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;
