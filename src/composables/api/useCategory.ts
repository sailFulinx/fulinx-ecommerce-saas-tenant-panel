import { usePreferenceStore } from '@/stores/preference'

export interface UseCategoryListOptions {
  /**
   * 是否在初始化时自动加载分类列表
   * @default true
   */
  immediate?: boolean
}

export const useCategory = (payload?: Partial<CategoryListParams>, options: UseCategoryListOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listCategoryPayload = reactive<CategoryListParams>({
    languageId: usePreferenceStore().preference?.language.id,
    categoryType: payload?.categoryType || 1,
    ...payload, // 合并外部传入的 payload
  })

  const listCategoryData = ref<TableResponse<CategoryData & CommonField>>({
    list: [],
    total: 0,
  })

  const getCategoryList = async () => {
    loading.value = true
    const { data } = await categoryListApi(listCategoryPayload).catch(error => {
      loading.value = false
      throw error
    })
    listCategoryData.value = { ...data }
    loading.value = false
  }

  // 如果 immediate 为 true，在初始化时自动加载数据
  if (immediate) {
    getCategoryList()
  }

  return {
    loading,
    listCategoryPayload,
    listCategoryData,
    getCategoryList,
  }
}
