import { usePreferenceStore } from '@/stores/preference'

export interface UseCommonOptions {
  /**
   * 是否在初始化时自动加载分类列表
   * @default true
   */
  immediate?: boolean
}

export const useLayoutTypeList = (payload?: Partial<ListLayoutTypeParams>, options: UseCommonOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<ListLayoutTypeParams>({
    ...payload,
  })

  const listData = ref<TableResponse<LayoutTypeData>>({
    list: [],
    total: 0,
  })

  const getList = async () => {
    loading.value = true
    const { data } = await fetchLayoutTypeListApi(listPayload).catch(error => {
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

export const useArticleTypeList = (payload?: Partial<ArticleTypeListParams>, options: UseCommonOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<ArticleTypeListParams>({
    ...payload,
  })

  const listData = ref<TableResponse<ArticleTypeData>>({
    list: [],
    total: 0,
  })
  const getList = async () => {
    loading.value = true
    const { data } = await fetchArticleTypeListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }
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

export const useProductTypeList = (payload?: Partial<ProductTypeListParams>, options: UseCommonOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<ProductTypeListParams>({
    ...payload,
  })

  const listData = ref<TableResponse<ProductTypeData>>({
    list: [],
    total: 0,
  })
  const getList = async () => {
    loading.value = true
    const { data } = await fetchProductTypeListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }
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

export const useProductSourceTypeList = (
  payload?: Partial<ProductSourceTypeListParams>,
  options: UseCommonOptions = {},
) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<ProductSourceTypeListParams>({
    ...payload,
  })

  const listData = ref<TableResponse<ProductSourceTypeData>>({
    list: [],
    total: 0,
  })
  const getList = async () => {
    loading.value = true
    const { data } = await fetchProductSourceTypeListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }
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

export const useAgeGroupTypeList = (payload?: Partial<AgeGroupTypeListParams>, options: UseCommonOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<AgeGroupTypeListParams>({
    ...payload,
  })

  const listData = ref<TableResponse<AgeGroupTypeData>>({
    list: [],
    total: 0,
  })
  const getList = async () => {
    loading.value = true
    const { data } = await fetchAgeGroupTypeListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }
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

export const useConditionTypeList = (payload?: Partial<ConditionTypeListParams>, options: UseCommonOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<ConditionTypeListParams>({
    ...payload,
  })

  const listData = ref<TableResponse<ConditionTypeData>>({
    list: [],
    total: 0,
  })
  const getList = async () => {
    loading.value = true
    const { data } = await fetchConditionTypeListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }
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

export const useGenderTypeList = (payload?: Partial<GenderTypeListParams>, options: UseCommonOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<GenderTypeListParams>({
    ...payload,
  })

  const listData = ref<TableResponse<GenderTypeData>>({
    list: [],
    total: 0,
  })
  const getList = async () => {
    loading.value = true
    const { data } = await fetchGenderTypeListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }
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

export const useWarehouseTypeList = (payload?: Partial<WarehouseTypeListParams>, options: UseCommonOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<WarehouseTypeListParams>({
    ...payload,
  })

  const listData = ref<TableResponse<WarehouseTypeData>>({
    list: [],
    total: 0,
  })
  const getList = async () => {
    loading.value = true
    const { data } = await fetchWarehouseTypeListApi(listPayload).catch(error => {
      loading.value = false
      throw error
    })
    listData.value = { ...data }
    loading.value = false
  }
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
