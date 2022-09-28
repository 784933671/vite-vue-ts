import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import qs from "qs";
import router from "@/router";
import { HRequestConfig } from "./config";
const defaultConfig = {
  baseURL: import.meta.env.VITE_HTTP_BASE_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    authentication: true, //是否鉴权 默认都需要鉴权
  },
  // 数组格式参数序列化
  paramsSerializer: (params: IObject<Object>) =>
    qs.stringify(params, { indices: false }),
};
class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  static axiosInstance: AxiosInstance = axios.create(defaultConfig);
  static loadingToast: Array<AnyObject> = [];
  httpInterceptorsRequest() {
    // 添加请求拦截器
    PureHttp.axiosInstance.interceptors.request.use(
      (config: HRequestConfig) => {
        const Authorization: string | null = localStorage.getItem("token");
        //authentication  是否开启鉴权模式
        if (Authorization && config.authentication) {
          (config.headers as AxiosRequestHeaders)["Authorization"] =
            Authorization;
        }
        return config;
      },
      function (error: AxiosError) {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );
  }
  httpInterceptorsResponse() {
    // 添加响应拦截器
    PureHttp.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 对响应数据做点什么
        if (response?.status === 200) {
          return response.data;
        }
      },
      (error: AxiosError) => {
        // 对响应错误做点什么
        if (axios.isCancel(error)) {
          return new Promise(() => {});
        } else {
          if (
            error.code === "ECONNABORTED" &&
            error.message.indexOf("timeout") !== -1
          ) {
            Promise.reject({ msg: "请求超时！" });
          } else if (error.response?.status === 401) {
            localStorage.removeItem("token");
            router.replace("/login");
            return Promise.reject({ msg: "登录失效！" });
          } else {
            return Promise.reject(error?.response?.data || error);
          }
        }
      }
    );
  }

  get<T = any>(url: string, option: AxiosConfig): Promise<T> {
    return PureHttp.axiosInstance.get(url, option);
  }
  post<T = any>(
    url: string,
    data: IObject<Object> | Array<IObject<Object>>,
    option?: AxiosConfig
  ): Promise<T> {
    return PureHttp.axiosInstance.post(url, data, option);
  }
}
export default new PureHttp();
