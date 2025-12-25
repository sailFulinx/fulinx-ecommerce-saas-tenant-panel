export function fetchLayoutTypeListApi(data?: ListLayoutTypeParams): Promise<IResponse<TableResponse<any>>> {
  return request.post({
    url: 'share/public/common/layout/type/list',
    data,
  })
}

export function fetchArticleTypeListApi(
  data?: ArticleTypeListParams,
): Promise<IResponse<TableResponse<ArticleTypeData>>> {
  return request.post({
    url: 'share/public/common/article/type/list',
    data,
  })
}
