import { usePreferenceStore } from '@/stores/preference'

export interface UseSystemCategoryListOptions {
  /**
   * 是否在初始化时自动加载分类列表
   * @default true
   */
  immediate?: boolean
}

export const useSystemCategory = (payload?: Partial<SystemCategoryListParams>, options: UseSystemCategoryListOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listSystemCategoryPayload = reactive<SystemCategoryListParams>({
    languageId: usePreferenceStore().preference?.language.id,
    systemCategoryType: payload?.systemCategoryType || 1,
    ...payload, // 合并外部传入的 payload
  })

  const listSystemCategoryData = ref<TableResponse<SystemCategoryData & CommonField>>({
    list: [],
    total: 0,
  })

  const getSystemCategoryList = async () => {
    loading.value = true
    const { data } = await shareSystemCategoryListApi(listSystemCategoryPayload).catch(error => {
      loading.value = false
      throw error
    })
    listSystemCategoryData.value = { ...data }
    loading.value = false
  }

  // 如果 immediate 为 true，在初始化时自动加载数据
  if (immediate) {
    getSystemCategoryList()
  }

  return {
    loading,
    listSystemCategoryPayload,
    listSystemCategoryData,
    getSystemCategoryList,
  }
}
