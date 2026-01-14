export const useParameterList = (payload?: Partial<ParameterListParams>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }
  return useList<(ParameterListData & CommonField), ParameterListParams>(parameterListApi, finalPayload, options)
}
