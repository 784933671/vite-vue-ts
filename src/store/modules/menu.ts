import { defineStore } from "pinia";
import { store } from "../index";
export const useMenuStore = defineStore({
  id: "menu",
  state: () => {
    return {
      menuList: [] as IMenubarList[],
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        //key的名称
        key: "menuList",
        //更改默认存储，我更改为localStorage
        storage: localStorage,
        // 默认是全部进去存储
        paths: ["menuList"],
      },
    ],
  },
  getters: {
    getMenuList(): IMenubarList[] {
      return this.menuList;
    },
  },
  actions: {
    setMenu(menuList: IMenubarList[]) {
      this.menuList = menuList;
    },
  },
});

export const useMenuStoreWithOut = () => {
  return useMenuStore(store);
};
