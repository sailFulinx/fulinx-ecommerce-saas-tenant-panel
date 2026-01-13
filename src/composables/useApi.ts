import type { Ref, UnwrapRef } from 'vue'
import { reactive, readonly, ref, toRaw } from 'vue'

export function useAdvancedList<T, P extends Record<string, any>>(
  fetchApi: (params: P) => Promise<any>,
  options: {
    defaultParams?: Partial<P>
    immediate?: boolean
    debounce?: number
    transformResponse?: (res: any) => TableResponse<T>
    dataKey?: string
    totalKey?: string
    // 新增：是否浅层响应式（性能优化）
    shallow?: boolean
  } = {},
) {
  const {
    defaultParams,
    immediate = true,
    debounce = 0,
    transformResponse,
    dataKey = 'data',
    totalKey = 'total',
    shallow = false,
  } = options

  const loading = ref(false)
  const error = ref<any>(null)
  const listData = ref<TableResponse<T>>({ list: [], total: 0 })

  // 根据配置选择响应式深度
  const reactiveFn = shallow ? shallowReactive : reactive
  const listPayload = reactiveFn<P>({ ...defaultParams } as P)

  const doFetch = async () => {
    loading.value = true
    error.value = null
    try {
      // 方案一：使用 toRaw 确保传递纯对象
      const rawPayload = toRaw(listPayload) as P
      const res = await fetchApi(rawPayload)

      let normalizedData: TableResponse<T>

      if (transformResponse) {
        normalizedData = transformResponse(res)
      } else {
        // 增强类型安全：验证数据结构
        const rawList = res?.[dataKey] ?? res
        normalizedData = {
          list: Array.isArray(rawList) ? rawList : [],
          total: res?.[totalKey] ?? (Array.isArray(rawList) ? rawList.length : 0),
        }
      }

      listData.value = normalizedData
      return normalizedData
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  // 防抖实现 - 添加类型注解
  const getList = debounce > 0 ? useDebounceFn(doFetch, debounce) : doFetch

  let promise: Promise<TableResponse<T>> | undefined
  if (immediate) {
    promise = getList() as Promise<TableResponse<T>>
  }

  return {
    loading: readonly(loading), // 返回只读版本，防止外部修改
    listPayload,
    listData: readonly(listData),
    error: readonly(error),
    getList,
    promise,
    refresh: getList,
    // 新增：重置参数方法
    resetParams: () => {
      Object.assign(listPayload, { ...defaultParams } as P)
    },
  }
}

/**
 * 通用列表请求Hook - 优化版
 * @template T 列表项数据类型
 * @template P 请求参数类型
 */
export function useList<T, P extends Record<string, any>>(
  fetchApi: (params: P) => Promise<{ data: TableResponse<T> }>,
  defaultParams?: Partial<P>,
  options: UseCommonOptions = {},
) {
  const { immediate = true } = options

  const loading = ref(false)
  const error = ref<Error | null>(null)
  const listPayload = reactive<P>({ ...defaultParams } as P)
  const listData = ref<TableResponse<T>>({
    list: [],
    total: 0,
  })

  const getList = async (): Promise<TableResponse<T>> => {
    // 避免重复请求
    if (loading.value) {
      return listData.value
    }

    loading.value = true
    error.value = null

    try {
      // 方案1：使用 toRaw 确保类型匹配
      const rawPayload = toRaw(listPayload) as P
      const { data } = await fetchApi(rawPayload)

      // 直接赋值，保持类型安全
      listData.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    } finally {
      loading.value = false
    }
  }

  // 重置参数方法
  const resetParams = () => {
    Object.assign(listPayload, { ...defaultParams } as P)
  }

  // 刷新方法
  const refresh = () => {
    return getList()
  }

  let promise: Promise<TableResponse<T>> | undefined
  if (immediate) {
    promise = getList()
  }

  return {
    // 返回只读版本，防止外部意外修改
    loading: readonly(loading),
    error: readonly(error),
    listPayload,
    listData: readonly(listData),
    getList,
    resetParams,
    refresh,
    promise,
  }
}
