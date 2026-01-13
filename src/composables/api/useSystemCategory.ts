import { usePreferenceStore } from '@/stores/preference'

export interface UseSystemCategoryListOptions {
  /**
   * 是否在初始化时自动加载分类列表
   * @default true
   */
  immediate?: boolean
}

export const useSystemCategoryList = (payload?: Partial<SystemCategoryListParams>, options: UseSystemCategoryListOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<SystemCategoryListParams>({
    languageId: usePreferenceStore().preference?.language.id,
    systemCategoryType: payload?.systemCategoryType || 1,
    ...payload, // 合并外部传入的 payload
  })

  const listData = ref<TableResponse<SystemCategoryData & CommonField>>({
    list: [],
    total: 0,
  })

  const getList = async () => {
    loading.value = true
    const { data } = await shareSystemCategoryListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }

  // 如果 immediate 为 true，在初始化时自动加载数据
  if (immediate) {
    getList()
  }

  return {
    loading,
    listPayload,
    listData,
    getList,
  }
}
