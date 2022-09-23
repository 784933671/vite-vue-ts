import { defineStore } from "pinia";
import { store } from "../index";
export const useAppStore = defineStore({
  id: "menu",
  state: () => {
    return {
      menuList: [] as Array<IMenubarList>,
    };
  },
  persist: {
    enabled: true,
  },
  getters: {
    getMenuList(): Array<IMenubarList> {
      return this.menuList;
    },
  },
  actions: {
    setFooter(menuList: Array<IMenubarList>) {
      this.menuList = menuList;
    },
  },
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
