import type { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { useTenantStore } from '@/stores/tenant'
import { config } from './config'

// 创建axios实例
const service: AxiosInstance = axios.create({
  timeout: config.request_timeout, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 根据 isTenantApi 参数决定使用哪个 baseURL
    if (config.headers.isTenantApi) {
      config.baseURL = import.meta.env.VITE_API_TENANT_URL
    } else {
      config.baseURL = import.meta.env.VITE_API_BUSINESS_URL
    }

    // 设置 X-API-ACCESS 头部
    const apiAccessKey = import.meta.env.VITE_X_API_ACCESS
    if (apiAccessKey) {
      config.headers['X-API-ACCESS'] = apiAccessKey
    } else {
      console.warn('VITE_X_API_ACCESS is not set')
    }

    // 获取租户store实例，添加X-TENANT-STORE-ID到请求头
    const tenantStore = useTenantStore()
    if (tenantStore.defaultStoreId) {
      config.headers['X-TENANT-STORE-ID'] = tenantStore.defaultStoreId
    }

    if (
      config.method === 'post'
      && (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }

    if (config.headers.token) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  },
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else {
      if (response.data.errorCode !== 0) {
        ElMessage({
          message: response.data.errorMessage || 'Error',
          type: 'error',
          duration: 5 * 1000,
        })
        ElMessage.error(response.data.errorMessage)
        return Promise.reject(new Error(response.data.errorMessage || 'Error'))
      }
      return response.data
    }
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const data = error.response?.data as any
      if (data.errorCode === -9) {
        ElMessage.error('无权限或TOKEN过期')
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        router.push('/auth/login')
        return Promise.reject(error)
      } else {
        router.push('/dashboard/analysis')
        ElMessage.error('无权限或TOKEN过期')
        return Promise.reject(error)
      }
    } else if (error.response?.status === 403) {
      ElMessage.error('不允许访问')
      router.push('/dashboard/analysis')
      return Promise.reject(error)
    }
    console.log(error) // for debug
    const resData = error?.response?.data as any
    const res = resData?.errorMessage ? resData.errorMessage : '失去响应，请检查网络'
    ElMessage.error(res)
    return Promise.reject(error)
  },
)

export { service }
