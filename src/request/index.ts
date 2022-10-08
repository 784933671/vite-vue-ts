import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosRequestHeaders } from "axios";
import router from "@/router";
import { HRequestConfig } from "./config";
import { axiosPromiseStore } from "@/store/modules/axiosPromise";
const defaultConfig: HRequestConfig = {
  baseURL: import.meta.env.VITE_HTTP_BASE_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
  },
  authentication: true, //是否鉴权 默认都需要鉴权
  // 数组格式参数序列化
  paramsSerializer: {
    indexes: null, // array indexes format (null - no brackets, false - empty brackets, true - brackets with indexes)
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
};
class HttpRequest {
  instance: AxiosInstance;
  axiosPromiseStore: any;
  //!组装请求地址和请求参数
  getRequestIdentify = (config: HRequestConfig, isReuest = false): string => {
    let url = config.url as string;
    if (isReuest) {
      url = config.baseURL + url.substring(1, url.length);
    }
    return config.method === "get"
      ? encodeURIComponent(url + JSON.stringify(config.params))
      : encodeURIComponent(config.url + JSON.stringify(config.data));
  };
  constructor() {
    this.axiosPromiseStore = axiosPromiseStore();
    this.instance = axios.create(defaultConfig);
    //! 添加请求拦截器
    this.instance.interceptors.request.use(
      (config: HRequestConfig) => {
        //增加请求的cancelToken
        let that = this;
        let requestData = this.getRequestIdentify(config, true);
        this.axiosPromiseStore.clearAxiosPromisCancel(requestData);
        config.cancelToken = new axios.CancelToken(function executor(c) {
          that.axiosPromiseStore.sourceActions({
            u: requestData,
            f: c,
          });
        });
        const Authorization: string | null = localStorage.getItem("token");
        //authentication  是否开启鉴权模式
        if (Authorization && config.authentication) {
          (config.headers as AxiosRequestHeaders)["Authorization"] =
            Authorization;
        }
        return config;
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );
    //! 添加响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 对响应数据做点什么
        if (response?.status === 200) {
          return response.data;
        }
      },
      (error) => {
        // 对响应错误做点什么
        if (axios.isCancel(error)) {
          return new Promise(() => {});
        } else {
          if (
            error.code === axios.AxiosError.ECONNABORTED &&
            error.message.indexOf("timeout") !== -1
          ) {
            console.log();
            return Promise.reject({ msg: "请求超时！" });
          } else if (error.response?.status === 401) {
            localStorage.removeItem("token");
            router.replace("/login");
            return Promise.reject({ msg: "登录失效！" });
          } else {
            console.log(error, "error");
            return Promise.reject(() => {});
          }
        }
      }
    );
  }
  get<T = any>(url: string, option?: AxiosConfig): Promise<T> {
    return this.instance.get(url, option);
  }
  post<T = any>(
    url: string,
    data: IObject<Object> | Array<IObject<Object>>,
    option?: AxiosConfig
  ): Promise<T> {
    return this.instance.post(url, data, option);
  }
}
export default new HttpRequest();
