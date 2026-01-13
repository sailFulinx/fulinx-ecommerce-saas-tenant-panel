export const useParameterList = (payload?: Partial<BrandListParams>, options: UseCommonOptions = {}) => {
  if (payload && !payload.languageId) {
    payload.languageId = usePreferenceStore().preference.languageId
  }
  return useList<ParameterListData, ParameterListParams>(parameterListApi, payload, options)
}
