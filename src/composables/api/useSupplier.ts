export const useSupplierPagination = (payload?: Partial<SupplierListParams & Pagination>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }

  return useList<SupplierListData, SupplierListParams>(supplierPaginationApi, finalPayload, options)
}

export const useSupplierList = (payload?: Partial<SupplierListParams>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }
  return useList<SupplierListData, SupplierListParams>(supplierListApi, finalPayload, options)
}
