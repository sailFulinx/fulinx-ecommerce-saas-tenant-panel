// 分类列表 - 分页
export function shareSystemCategoryPaginationApi(
  data?: SystemCategoryListParams & Pagination,
): Promise<IResponse<TableResponse<SystemCategoryData & CommonField>>> {
  return request.post({
    url: 'share/public/system/systemCategory/pagination',
    data,
  })
}

// 分类列表 - 无分页
export function shareSystemCategoryListApi(data?: SystemCategoryListParams): Promise<IResponse<TableResponse<SystemCategoryData & CommonField>>> {
  return request.post({
    url: 'share/public/system/systemCategory/list',
    data,
    token: true,
  })
}

// 查看分类
export function shareSystemCategoryShowApi(data: SystemCategoryShowParams): Promise<IResponse<SystemCategoryShowData>> {
  return request.post({
    url: 'share/public/system/systemCategory/show',
    data,
    token: true,
  })
}
