export const useSupplierPagination = (payload?: Partial<SupplierListParams & Pagination>, options: UseCommonOptions = {}) => {
  if (payload && !payload.languageId) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  return useList<SupplierListData, SupplierListParams>(supplierPaginationApi, payload, options)
}

export const useSupplierList = (payload?: Partial<SupplierListParams>, options: UseCommonOptions = {}) => {
  if (payload && !payload.languageId) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  return useList<SupplierListData, SupplierListParams>(supplierListApi, payload, options)
}
