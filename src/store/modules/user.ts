import { defineStore } from "pinia";
import { store } from "../index";
export const useAppStore = defineStore({
  id: "user",
  state: () => {
    return {
      name: "张三",
      age: 18,
    };
  },
  persist: {
    enabled: true,
  },
  getters: {
    getBreadcrumb(): string {
      return this.name;
    },
  },
  actions: {
    setFooter(footer: string) {
      this.name = footer;
    },
  },
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
