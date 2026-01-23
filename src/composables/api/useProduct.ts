export const useProductPagination = (payload?: Partial<ProductListParams & Pagination>, options: UseCommonOptions = {}) => {
  return useList<ProductListData & CommonField, ProductListParams & Pagination>(productPaginationApi, payload, options)
}
