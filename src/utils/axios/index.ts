import type { AxiosRequestConfig } from 'axios'
import { config } from './config'
import { service } from './service'

const { default_headers } = config

// 定义请求参数类型（可扩展）
export interface RequestOption extends AxiosRequestConfig {
  headersType?: string
  token?: boolean
  isBusinessApi?: boolean
}

// request 函数支持泛型
const request = <T>(option: RequestOption) => {
  const { url, method, params, data, headersType, responseType, token } = option
  return service({
    url,
    method,
    params,
    data,
    responseType,
    headers: {
      'Content-Type': headersType || default_headers,
      token,
    },
  }) as Promise<T>
}

// 为每个方法保留泛型
export default {
  get: <T>(option: RequestOption) => request<T>({ method: 'get', ...option }),
  post: <T>(option: RequestOption) => request<T>({ method: 'post', ...option }),
  delete: <T>(option: RequestOption) => request<T>({ method: 'delete', ...option }),
  put: <T>(option: RequestOption) => request<T>({ method: 'put', ...option }),
}
