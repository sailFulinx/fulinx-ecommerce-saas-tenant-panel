import { usePreferenceStore } from '@/stores/preference'

export interface UseParameterListOptions {
  /**
   * 是否在初始化时自动加载分类列表
   * @default true
   */
  immediate?: boolean
}

export const useParameterList = (payload?: Partial<ParameterListParams>, options: UseParameterListOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<ParameterListParams>({
    languageId: usePreferenceStore().preference?.language.id,
    ...payload, // 合并外部传入的 payload
  })

  const listData = ref<TableResponse<ParameterListData & CommonField>>({
    list: [],
    total: 0,
  })

  const getList = async () => {
    loading.value = true
    const { data } = await parameterListApi(listPayload).catch(error => {
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
