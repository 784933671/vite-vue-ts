import { ucfirst } from "@/utils/tools";
// 动态路由名称映射表
const components: IObject<() => Promise<typeof import("*.vue")>> = {
  Layout: (() => import("@/layout/index.vue")) as unknown as () => Promise<
    typeof import("*.vue")
  >,
};
/*
 *@描述:查找所有views下的vue文件并引入
 *@方法名: jsfn
 *@参数: 参数1
 *@作者: TangTao
 *@时间: 2022-09-29 14:06:59
 *@版本: V1.0.0
 */
const modules = import.meta.glob("../views/**/**.vue");
Object.keys(modules).forEach((key) => {
  const nameMatch = key.match(/^\.\.\/views\/(.+)\.vue/);
  if (!nameMatch) return;
  // 排除_Components文件夹下的文件
  if (nameMatch[1].includes("components")) return;
  let name = ucfirst(nameMatch[1]);
  components[name] = modules[key] as () => Promise<typeof import("*.vue")>;
});

/*
 *@描述:路由解析并转换并引入vue
 *@方法名: jsfn
 *@参数: 参数1
 *@作者: TangTao
 *@时间: 2022-09-29 14:06:18
 *@版本: V1.0.0
 */
const generatorDynamicRouter = (
  menuList: Array<IMenubarList>
): Array<IMenubarList> => {
  const routerList: IMenubarList[] = JSON.parse(JSON.stringify(menuList));
  const f = (data: IMenubarList[]) => {
    for (let i = 0, len = data.length; i < len; i++) {
      const v: IMenubarList = data[i];
      if (typeof v.component === "string") {
        v.component = components[v.component];
      }
      if (v.children && v.children.length > 0) {
        f(v.children);
      }
    }
  };
  f(routerList);
  return routerList;
};
export { components, generatorDynamicRouter };
