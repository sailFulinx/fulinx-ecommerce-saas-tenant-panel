export const useBrandPagination = (payload?: Partial<BrandListParams & Pagination>, options: UseCommonOptions = {}) => {
  if (payload && !payload.languageId) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  return useList<BrandListData, BrandListParams>(brandPaginationApi, payload, options)
}

export const useBrandList = (payload?: Partial<BrandListParams>, options: UseCommonOptions = {}) => {
  if (payload && !payload?.languageId) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  if (!payload) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  return useList<BrandListData, BrandListParams>(brandListApi, payload, options)
}
