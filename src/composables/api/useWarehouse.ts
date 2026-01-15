export const useWarehousePagination = (payload?: Partial<WarehouseListParams & Pagination>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }
  return useList<(WarehouseData & CommonField), WarehouseListParams>(warehousePaginationApi, finalPayload, options)
}

export const useWarehouseList = (payload?: Partial<WarehouseListParams>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id

  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }

  return useList<WarehouseData & CommonField, WarehouseListParams>(warehouseListApi, finalPayload, options)
}
