import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosPromise,
} from "axios";
import qs from "qs";
const defaultConfig = {
  baseURL: import.meta.env.VITE_HTTP_BASE_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
  },
  // 数组格式参数序列化
  paramsSerializer: (params: AnyObject) =>
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
      (config: AxiosRequestConfig) => {
        const Authorization: string | null = localStorage.getItem("token");
        //如果存在token，在请求头中添加token
        if (Authorization) {
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
            return new Promise(() => {});
          } else if (error.response?.status === 401) {
            localStorage.removeItem("token");
            return Promise.reject({ msg: "登录失效！" });
          } else {
            return Promise.reject(error?.response?.data || error);
          }
        }
      }
    );
  }

  get<T = any>(url: string, option: AxiosConfig): AxiosPromise<T> {
    return PureHttp.axiosInstance.get(url, option);
  }
  post<T = any>(url: string, data: any, option?: AxiosConfig): AxiosPromise<T> {
    return PureHttp.axiosInstance.post(url, data, option);
  }
}
export default new PureHttp();
