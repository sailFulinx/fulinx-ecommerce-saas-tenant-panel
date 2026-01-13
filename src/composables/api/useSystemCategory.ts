export const useSystemCategoryList = (payload?: Partial<SystemCategoryListParams>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }
  return useList<SystemCategoryData, SystemCategoryListParams>(shareSystemCategoryListApi, finalPayload, options)
}
