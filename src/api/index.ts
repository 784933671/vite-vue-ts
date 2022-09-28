import http from "@/request";

const api = {
  getRouterList: "/menu/getMenuToTreeByUserId",
};
//获取菜单列表
export const getRouterList = () => {
  return http.post<DataType<IMenubarList>>(api.getRouterList, { id: 3 });
};
