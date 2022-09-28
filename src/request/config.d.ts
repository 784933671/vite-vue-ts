import type { AxiosRequestConfig } from "axios";

export interface HRequestConfig<D = any> extends AxiosRequestConfig<D> {
  authentication?: boolean;
}
