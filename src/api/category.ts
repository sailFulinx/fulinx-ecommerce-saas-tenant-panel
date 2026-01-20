// 分类列表 - 分页
export function categoryPaginationApi(
  data?: CategoryListParams & Pagination,
): Promise<IResponse<TableResponse<CategoryData & CommonField>>> {
  return request.post({
    url: 'system/category/pagination',
    data,
    token: true,
  })
}

// 分类列表 - 无分页
export function categoryListApi(data?: CategoryListParams): Promise<IResponse<TableResponse<CategoryData & CommonField>>> {
  return request.post({
    url: 'system/category/list',
    data,
    token: true,
  })
}

// 查看分类
export function categoryShowApi(data: CategoryShowParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/show',
    data,
    token: true,
  })
}

// 删除分类
export function categoryRemoveApi(data: RemoveCategoryParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/category',
    data,
    token: true,
  })
}
