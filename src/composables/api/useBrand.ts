import { usePreferenceStore } from '@/stores/preference'

export interface UseBrandListOptions {
  /**
   * 是否在初始化时自动加载供应商列表
   * @default true
   */
  immediate?: boolean
}

export const useBrandPagination = (
  payload?: Partial<BrandListParams & Pagination>,
  options: UseBrandListOptions = {},
) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<BrandListParams & Pagination>({
    languageId: usePreferenceStore().preference?.language.id,
    pageSize: payload?.pageSize ?? 20,
    pageNumber: payload?.pageNumber ?? 1,
    ...payload,
  })

  const listData = ref<TableResponse<BrandListData & CommonField>>({
    list: [],
    total: 0,
  })

  const getBrandList = async () => {
    loading.value = true
    if (listPayload.brandName === '') {
      listPayload.brandName = null
    }
    const { data } = await brandPaginationApi(listPayload).catch(err => {
      loading.value = false
      throw err
    })
    listData.value = data
    loading.value = false
  }

  // 如果 immediate 为 true，在初始化时自动加载数据
  if (immediate) {
    getBrandList()
  }

  return {
    loading,
    listPayload,
    listData,
    getBrandList,
  }
}

export const useBrandList = (payload?: Partial<BrandListParams>, options: UseBrandListOptions = {}) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listPayload = reactive<BrandListParams>({
    languageId: usePreferenceStore().preference?.language.id,
    ...payload,
  })

  const listData = ref<TableResponse<BrandListData & CommonField>>({
    list: [],
    total: 0,
  })

  const getBrandList = async () => {
    loading.value = true
    if (listPayload.brandName === '') {
      listPayload.brandName = null
    }
    const { data } = await brandListApi(listPayload).catch(err => {
      loading.value = false
      throw err
    })
    listData.value = data
    loading.value = false
  }

  // 如果 immediate 为 true，在初始化时自动加载数据
  if (immediate) {
    getBrandList()
  }

  return {
    loading,
    listPayload,
    listData,
    getBrandList,
  }
}
