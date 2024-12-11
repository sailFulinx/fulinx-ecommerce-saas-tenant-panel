import request from '@/utils/axios'

export function showCustomerApi(id: string): Promise<IResponse<CustomerShowData & CommonField>> {
  return request.get({
    url: `system/customer/show/${id}`,
    token: true,
  })
}

export function customerListApi(
  params: CustomerListParams,
): Promise<IResponse<TableResponse<CustomerListData & CommonField>>> {
  return request.post({
    url: 'system/customer/list',
    data: params,
    token: true,
  })
}

export function customerPaginationApi(
  params: CustomerListParams & Pagination,
): Promise<IResponse<TableResponse<CustomerListData & CommonField>>> {
  return request.post({
    url: 'system/customer/pagination',
    data: params,
    token: true,
  })
}
