export const useSystemCategoryList = (payload?: Partial<SystemCategoryListParams>, options: UseCommonOptions = {}) => {
  if (payload && !payload.languageId) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  return useList<SystemCategoryData, SystemCategoryListParams>(systemCategoryListApi, payload, options)
}
