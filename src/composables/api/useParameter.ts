import { usePreferenceStore } from '@/stores/preference'

export interface UseParameterListOptions {
  /**
   * 是否在初始化时自动加载分类列表
   * @default true
   */
  immediate?: boolean
}

export const useParameter = (payload?: Partial<ParameterListParams>, options: UseParameterListOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listParameterPayload = reactive<ParameterListParams>({
    languageId: usePreferenceStore().preference?.language.id,
    ...payload, // 合并外部传入的 payload
  })

  const listParameterData = ref<TableResponse<ParameterListData & CommonField>>({
    list: [],
    total: 0,
  })

  const getParameterList = async () => {
    loading.value = true
    const { data } = await parameterListApi(listParameterPayload).catch(error => {
      loading.value = false
      throw error
    })
    listParameterData.value = { ...data }
    loading.value = false
  }

  // 如果 immediate 为 true，在初始化时自动加载数据
  if (immediate) {
    getParameterList()
  }

  return {
    loading,
    listParameterPayload,
    listParameterData,
    getParameterList,
  }
}
