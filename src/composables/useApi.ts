import type { Ref, UnwrapNestedRefs } from 'vue'
import { onScopeDispose, reactive, readonly, ref, toRaw } from 'vue'

// 类型定义
export interface TableResponse<T = any> {
  list: T[]
  total: number
}

export interface ListHookResult<T, P extends Record<string, any>> {
  loading: Readonly<Ref<boolean>>
  listPayload: UnwrapNestedRefs<P> // 修改为响应式类型
  listData: Readonly<Ref<TableResponse<T>>>
  getList: () => Promise<TableResponse<T>>
  refresh: () => void
  resetParams: () => void
  promise?: Promise<TableResponse<T>>
}

export interface UseCommonOptions<T = any> {
  /**
   * 是否在初始化时自动请求列表数据
   * @default true
   */
  immediate?: boolean
  /**
   * 防抖延迟时间(ms)
   * @default 0
   */
  debounce?: number
  /**
   * 响应式数据浅层模式
   * @default false
   */
  shallow?: boolean
  /**
   * 响应数据转换函数
   */
  transformResponse?: (response: any) => TableResponse<T>
}

/**
 * 防抖函数实现
 */
function useDebounceFn<T extends (...args: any[]) => any>(fn: T, wait: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => fn(...args), wait)
  }) as T
}

/**
 * 通用列表请求Hook
 * @template T 列表项数据类型
 * @template P 请求参数类型
 */
export function useList<T, P extends Record<string, any>>(
  fetchApi: (params: P) => Promise<any>,
  defaultParams: Partial<P> = {},
  options: UseCommonOptions<T> = {},
): ListHookResult<T, P> {
  const { immediate = true, debounce = 0, transformResponse } = options

  // 响应式状态
  const loading = ref(false)
  const listPayload = reactive<P>({ ...defaultParams } as P)
  const listData = ref<TableResponse<T>>({ list: [], total: 0 })

  // 请求控制
  let abortController: AbortController | null = null

  /**
   * 核心请求方法
   */
  const getList = async (): Promise<TableResponse<T>> => {
    // 取消上一个请求
    if (abortController) {
      abortController.abort()
    }

    abortController = new AbortController()
    loading.value = true

    try {
      const rawPayload = toRaw(listPayload) as P
      const response = await fetchApi(rawPayload)

      let normalizedData: TableResponse<T>

      if (transformResponse) {
        normalizedData = transformResponse(response)
      } else {
        // 默认响应处理
        const responseData = response?.data || response
        normalizedData = {
          list: Array.isArray(responseData?.list)
            ? responseData.list
            : Array.isArray(responseData?.data)
              ? responseData.data
              : Array.isArray(responseData?.items)
                ? responseData.items
                : Array.isArray(responseData)
                  ? responseData
                  : [],
          total:
            responseData?.total
            ?? responseData?.meta?.total
            ?? (Array.isArray(responseData?.list)
              ? responseData.list.length
              : Array.isArray(responseData?.data)
                ? responseData.data.length
                : Array.isArray(responseData)
                  ? responseData.length
                  : 0),
        }
      }

      listData.value = normalizedData
      return normalizedData
    } catch (error: any) {
      // 忽略手动取消的请求
      if (error?.name !== 'AbortError') {
        console.error('List request failed:', error)
      }
      throw error
    } finally {
      loading.value = false
      abortController = null
    }
  }

  /**
   * 防抖请求包装
   */
  const debouncedGetList = debounce > 0 ? useDebounceFn(getList, debounce) : getList

  /**
   * 刷新列表
   */
  const refresh = () => {
    debouncedGetList()
  }

  /**
   * 重置查询参数
   */
  const resetParams = () => {
    // 安全地重置参数
    Object.keys(listPayload).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(listPayload, key)) {
        delete (listPayload as any)[key]
      }
    })
    Object.assign(listPayload, { ...defaultParams } as P)
  }

  // 自动清理
  onScopeDispose(() => {
    if (abortController) {
      abortController.abort()
    }
  })

  // 立即执行
  let promise: Promise<TableResponse<T>> | undefined
  if (immediate) {
    promise = debouncedGetList()
  }

  return {
    loading: readonly(loading),
    listPayload: listPayload as UnwrapNestedRefs<P>, // 类型断言
    listData: readonly(listData) as Readonly<Ref<TableResponse<T>>>,
    getList: debouncedGetList,
    refresh,
    resetParams,
    promise,
  }
}
