export const useCategoryList = (payload?: Partial<CategoryListParams>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
    categoryType: 1,
  }
  return useList<CategoryData, CategoryListParams>(categoryListApi, finalPayload, options)
}
