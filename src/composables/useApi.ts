import type { Ref, ShallowRef } from 'vue'
import { onScopeDispose, reactive, readonly, ref, shallowRef, toRaw } from 'vue'

// ==================== 类型定义 ====================
export interface TableResponse<T = any> {
  list: T[]
  total: number
}

export interface UseListOptions<T, P> {
  /** 默认请求参数 */
  defaultParams?: Partial<P>
  /** 是否立即发起请求 */
  immediate?: boolean
  /** 防抖延迟（毫秒） */
  debounce?: number
  /** 自定义响应数据转换函数 */
  transformResponse?: (res: any) => TableResponse<T>
  /** 响应数据中列表的键名，支持路径（如 'data.list'） */
  dataKey?: string
  /** 响应数据中总数的键名 */
  totalKey?: string
  /** 是否使用浅层响应式（针对大量数据时性能优化） */
  shallow?: boolean
  /** 请求成功钩子 */
  onSuccess?: (data: TableResponse<T>) => void
  /** 请求失败钩子 */
  onError?: (error: any) => void
  /** 是否允许自动取消未完成的请求 */
  cancelOnUnmount?: boolean
}

// ==================== 核心实现 ====================
export function useList<T = any, P extends Record<string, any> = Record<string, any>>(
  fetchApi: (params: P, controller?: AbortController) => Promise<any>,
  options: UseListOptions<T, P> = {},
) {
  const {
    defaultParams = {},
    immediate = true,
    debounce = 0,
    transformResponse,
    dataKey = 'data',
    totalKey = 'total',
    shallow = false,
    onSuccess,
    onError,
    cancelOnUnmount = true,
  } = options

  // ========== 状态定义 ==========
  const loading = ref(false)
  const error = ref<any>(null)
  // 根据 shallow 配置选择响应式深度
  const reactiveRef = shallow ? shallowRef : ref
  const listData = reactiveRef<TableResponse<T>>({ list: [], total: 0 })
  const listPayload = reactive<P>({ ...defaultParams } as P)

  // ========== 请求控制 ==========
  let currentController: AbortController | null = null

  /** 核心请求方法 */
  const executeRequest = async (): Promise<TableResponse<T>> => {
    // 取消上一个未完成的请求
    if (currentController) {
      currentController.abort()
    }

    const controller = new AbortController()
    currentController = controller

    loading.value = true
    error.value = null

    try {
      // 确保传递的是纯对象，避免响应式数据引起问题
      const rawPayload = toRaw(listPayload) as P
      const response = await fetchApi(rawPayload, controller)

      // 如果请求被取消，则忽略响应
      if (controller.signal.aborted) {
        throw new DOMException('请求被取消', 'AbortError')
      }

      let normalizedData: TableResponse<T>

      if (transformResponse) {
        normalizedData = transformResponse(response)
      } else {
        // 增强的默认响应解析，支持嵌套路径（简单实现）
        const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => o?.[k], obj)

        const rawList = getNestedValue(response, dataKey) ?? response
        normalizedData = {
          list: Array.isArray(rawList) ? rawList : [],
          total: getNestedValue(response, totalKey) ?? (Array.isArray(rawList) ? rawList.length : 0),
        }
      }

      // 更新响应式数据
      listData.value = normalizedData

      // 成功回调
      onSuccess?.(normalizedData)
      return normalizedData
    } catch (err: any) {
      // 忽略主动取消的请求错误
      if (err?.name !== 'AbortError') {
        error.value = err
        onError?.(err)
      }
      throw err
    } finally {
      if (!controller.signal.aborted) {
        loading.value = false
      }
      currentController = null
    }
  }

  // ========== 防抖实现 ==========
  // 注意：此处需要项目中有 useDebounceFn 或类似实现
  // 假设 useDebounceFn 接收一个函数和延迟时间，返回防抖后的函数
  const debouncedExecute = debounce > 0 ? useDebounceFn(executeRequest, debounce) : executeRequest

  // 包装一下，确保防抖函数返回 Promise
  const getList = async (): Promise<TableResponse<T>> => {
    return debouncedExecute() as Promise<TableResponse<T>>
  }

  // ========== 副作用清理 ==========
  if (cancelOnUnmount) {
    onScopeDispose(() => {
      if (currentController) {
        currentController.abort()
      }
    })
  }

  // ========== 公共方法 ==========
  /** 刷新列表 */
  const refresh = () => getList()

  /** 重置参数并刷新 */
  const resetParams = () => {
    Object.keys(listPayload).forEach(key => {
      delete listPayload[key]
    })
    Object.assign(listPayload, { ...defaultParams } as P)
    return getList()
  }

  /** 取消当前请求 */
  const cancel = () => {
    if (currentController) {
      currentController.abort()
    }
  }

  // ========== 立即执行 ==========
  let immediatePromise: Promise<TableResponse<T>> | undefined
  if (immediate) {
    immediatePromise = getList()
  }

  // ========== 返回 ==========
  return {
    /** 加载状态 */
    loading: readonly(loading),
    /** 错误信息 */
    error: readonly(error),
    /** 请求参数 */
    listPayload,
    /** 列表数据 */
    listData: readonly(listData),
    /** 获取列表方法 */
    getList,
    /** 刷新列表（getList 的别名） */
    refresh,
    /** 重置参数 */
    resetParams,
    /** 取消请求 */
    cancel,
    /** 立即执行时的 Promise（如果 immediate 为 true） */
    promise: immediatePromise,
  }
}
