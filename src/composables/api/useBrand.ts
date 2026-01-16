export const useBrandPagination = (payload?: Partial<BrandListParams & Pagination>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }
  return useList<BrandListData & CommonField, BrandListParams & Pagination>(brandPaginationApi, finalPayload, options)
}

export const useBrandList = (payload?: Partial<BrandListParams>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id

  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }

  return useList<BrandListData & CommonField, BrandListParams>(brandListApi, finalPayload, options)
}
