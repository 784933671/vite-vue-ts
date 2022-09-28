import { defineStore } from "pinia";
import { store } from "../index";
export const axiosPromiseStore = defineStore({
  id: "axiosPromise",
  state: () => {
    return {
      source: [] as Array<IObject<any>>,
    };
  },
  getters: {},
  actions: {
    sourceActions(source: IObject<any>) {
      this.source.push(source);
    },
    clearAxiosPromisCancel(key: string) {
      this.source.forEach((item, index) => {
        if (item.u == key) {
          item.f("取消重复请求");
          this.source.slice(index);
        }
      });
    },
    clearAllAxiosPromisCancel() {
      this.source.forEach((item) => {
        item.f("取消重复请求");
      });
      this.source = [];
    },
  },
});

export const useAxiosPromiseStoreWithOut = () => {
  return axiosPromiseStore(store);
};
