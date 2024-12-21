import request from '@/utils/axios'

export function createImportApi(data: any): Promise<IResponse> {
  return request.post({
    url: 'system/custom/imps',
    token: true,
    data,
  })
}

export function fetchImpDetailApi(id: string): Promise<IResponse<ImpLogResponseDataType>> {
  return request.get({
    url: `system/custom/imps/${id}`,
    token: true,
  })
}

export function fetchImpPaginationApi(
  data: Pagination & ImpRequestQueryParameterType,
): Promise<IResponse<TableResponse<ImpListResponseDataType>>> {
  return request.post({
    url: 'system/custom/imps/pagination',
    token: true,
    data,
  })
}
