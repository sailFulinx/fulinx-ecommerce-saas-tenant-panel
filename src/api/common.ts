export function fetchLayoutTypeListApi(data?: ListLayoutTypeParams): Promise<IResponse<TableResponse<any>>> {
  return request.post({
    url: 'share/public/common/layout/type/list',
    data,
  })
}
