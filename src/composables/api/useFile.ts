export const useFilePagination = (payload?: Partial<FileListParams & Pagination>, options: UseCommonOptions = {}) => {
  const languageId = usePreferenceStore().preference.language.id
  // 使用空值合并运算符简化逻辑
  const finalPayload = {
    languageId,
    ...payload,
  }
  return useList<FileListData & CommonField, FileListParams>(filePaginationApi, finalPayload, options)
}
