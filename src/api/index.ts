import HttpRequest from "@/request";

const api = {
  getRouterList: "/menu/getMenuToTreeByUserId",
};
//获取菜单列表
export const getRouterList = () => {
  return HttpRequest.post<DataType<IMenubarList>>(api.getRouterList, { id: 3 });
};
