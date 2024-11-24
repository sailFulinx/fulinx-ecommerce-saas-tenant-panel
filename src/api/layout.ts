import request from '@/utils/axios'

export function createLayoutApi(data: CreateLayoutParams): Promise<IResponse<LayoutData & CommonField>> {
  return request.post({
    url: 'system/layout',
    data,
    token: true,
  })
}

export function copyLayoutApi(data: CopyLayoutParams): Promise<IResponse<LayoutData & CommonField>> {
  return request.post({
    url: 'system/layout/copy',
    data,
    token: true,
  })
}

export function removeLayoutApi(data: RemoveLayoutParams): Promise<IResponse<LayoutData & CommonField>> {
  return request.delete({
    url: 'system/layout',
    data,
    token: true,
  })
}

export function editLayoutApi(id: number, data: UpdateLayoutParams): Promise<IResponse<LayoutData & CommonField>> {
  return request.put({
    url: `system/layout/${id}`,
    data,
    token: true,
  })
}

export function showLayoutApi(id: number): Promise<IResponse<LayoutData & CommonField>> {
  return request.get({
    url: `system/layout/${id}`,
    token: true,
  })
}

export function layoutPaginationApi(
  data: LayoutListParams & Pagination,
): Promise<IResponse<TableResponse<LayoutData & CommonField>>> {
  return request.post({
    url: 'system/layout/pagination',
    data,
    token: true,
  })
}

export function layoutListApi(
  data: LayoutListParams,
): Promise<IResponse<TableResponse<LayoutData & CommonField>>> {
  return request.post({
    url: 'system/layout/list',
    data,
    token: true,
  })
}
