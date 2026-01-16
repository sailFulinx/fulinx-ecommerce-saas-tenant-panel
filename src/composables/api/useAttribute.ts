export const useAttributePagination = (payload?: Partial<AttributeListParams & Pagination>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }
  return useList<(AttributeListData & CommonField), AttributeListParams & Pagination>(attributePaginationApi, finalPayload, options)
}

export const useAttributeList = (payload?: Partial<AttributeListParams>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id

  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }

  return useList<(AttributeListData & CommonField), AttributeListParams>(attributeListApi, finalPayload, options)
}
