import type { PropType } from "vue";
export {};
declare global {
  declare type PropsType<T> = PropType<T>;
  declare type AxiosResponseType =
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";

  declare type AxiosConfig = {
    params?: any;
    baseURL?: string;
    responseType?: AxiosResponseType;
    headers?: Record<string | "authentication", string | number | boolean>;
  };
  interface IObject<T> {
    [index: string]: T;
  }
  interface DataType<T> {
    data: T;
    code: number;
  }
  interface IMenubarList {
    parentId?: number | string;
    id?: number | string;
    name: string;
    path: string;
    redirect?: string | { name: string };
    meta: {
      icon?: string;
      title: string;
      activeMenu?: string; // 路由设置了该属性，则会高亮相对应的侧边栏
      noCache?: boolean; // 页面是否不缓存
      hidden?: boolean; // 是否隐藏路由
      alwaysShow?: boolean; // 当子路由只有一个的时候是否显示当前路由
    };
    component: (() => Promise<typeof import("*.vue")>) | string;
    children?: Array<IMenubarList>;
  }
}
