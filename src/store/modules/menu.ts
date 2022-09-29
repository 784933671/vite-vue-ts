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
