import HttpRequest from "@/request";
import type { menuParamsType } from "./type";
const api = {
  getRouterList: "/menu/getMenuToTreeByUserId",
  login: "/admin/login",
  info: "/admin/info",
};

//获取菜单列表
export const getRouterList = async (params: menuParamsType) => {
  return HttpRequest.post<DataType<IMenubarList[]>>(api.getRouterList, params);
};

export const login = async () => {
  return HttpRequest.post(api.login, { username: "admin", password: "123456" });
};

export const getUserInfo = async () => {
  return HttpRequest.get(api.info);
};
