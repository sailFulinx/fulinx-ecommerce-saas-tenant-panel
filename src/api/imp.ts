import request from '@/utils/axios'

export function createImportApi(data: any): Promise<IResponse> {
  return request.post({
    url: 'system/imp',
    token: true,
    data,
  })
}

export function fetchImpDetailApi(id: number): Promise<IResponse<ImpLogResponseDataType>> {
  return request.get({
    url: `system/imp/${id}`,
    token: true,
  })
}

export function fetchImpPaginationApi(
  data: Pagination & ImpRequestQueryParameterType,
): Promise<IResponse<TableResponse<ImpListResponseDataType>>> {
  return request.post({
    url: 'system/imp/pagination',
    token: true,
    data,
  })
}
