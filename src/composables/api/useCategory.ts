export const useCategoryList = (payload?: Partial<CategoryListParams>, options: UseCommonOptions = {}) => {
  if (payload && !payload.languageId) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  return useList<CategoryData, CategoryListParams>(categoryListApi, payload, options)
}
