import request from '@/utils/axios'

export function createCompApi(data: CreateComponentParams): Promise<IResponse<CompData & CommonField>> {
  return request.post({
    url: 'system/component',
    data,
    token: true,
  })
}

export function copyCompApi(data: CopyComponentParams): Promise<IResponse<CompData & CommonField>> {
  return request.post({
    url: 'system/component/copy',
    data,
    token: true,
  })
}

export function removeCompApi(data: RemoveCompParams): Promise<IResponse<CompData & CommonField>> {
  return request.delete({
    url: 'system/component',
    data,
    token: true,
  })
}

export function editCompApi(id: number, data: UpdateComponentParams): Promise<IResponse<CompData & CommonField>> {
  return request.put({
    url: `system/component/${id}`,
    data,
    token: true,
  })
}

export function showCompApi(id: number): Promise<IResponse<CompData & CommonField>> {
  return request.get({
    url: `system/component/${id}`,
    token: true,
  })
}

export function componentPaginationApi(
  data: CompListParams & Pagination,
): Promise<IResponse<TableResponse<CompData & CommonField>>> {
  return request.post({
    url: 'system/component/pagination',
    data,
    token: true,
  })
}

export function componentListApi(
  data: CompListParams,
): Promise<IResponse<TableResponse<CompData & CommonField>>> {
  return request.post({
    url: 'system/component/list',
    data,
    token: true,
  })
}
