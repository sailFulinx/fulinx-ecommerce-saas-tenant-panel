import { usePreferenceStore } from '@/stores/preference'

export interface UseSupplierListOptions {
  /**
   * 是否在初始化时自动加载供应商列表
   * @default true
   */
  immediate?: boolean
}

export const useSupplier = (
  payload?: Partial<SupplierListParams & Pagination>,
  options: UseSupplierListOptions = {},
) => {
  const { immediate = true } = options

  const loading = ref(false)

  const listSupplierQuery = reactive<SupplierListParams & Pagination>({
    languageId: usePreferenceStore().preference?.language.id,
    pageSize: payload?.pageSize ?? 20,
    pageNumber: payload?.pageNumber ?? 1,
    ...payload,
  })

  const listSupplierResult = ref<TableResponse<SupplierListData & CommonField>>({
    list: [],
    total: 0,
  })

  const getSupplierList = async () => {
    loading.value = true
    if (listSupplierQuery.supplierName === '') {
      listSupplierQuery.supplierName = null
    }
    const { data } = await supplierPaginationApi(listSupplierQuery).catch(err => {
      loading.value = false
      throw err
    })
    listSupplierResult.value = data
    loading.value = false
  }

  // 如果 immediate 为 true，在初始化时自动加载数据
  if (immediate) {
    getSupplierList()
  }

  return {
    loading,
    listSupplierQuery,
    listSupplierResult,
    getSupplierList,
  }
}
