import request from '@/utils/axios'

export function showOrderApi(id: string): Promise<IResponse<OrderData & CommonField>> {
  return request.get({
    url: `system/order/show/${id}`,
    token: true,
  })
}

export function orderListApi(params: OrderListParams): Promise<IResponse<TableResponse<OrderData & CommonField>>> {
  return request.post({
    url: 'system/order/list',
    data: params,
    token: true,
  })
}

export function orderPaginationApi(
  params: OrderListParams & Pagination,
): Promise<IResponse<TableResponse<OrderData & CommonField>>> {
  return request.post({
    url: 'system/order/pagination',
    data: params,
    token: true,
  })
}
