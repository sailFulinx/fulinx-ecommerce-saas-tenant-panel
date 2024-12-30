import request from '@/utils/axios'

export function approvalOrderApi(data: OrderApprovalParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/order/approval',
    data,
    token: true,
  })
}

export function updateOrderStatusApi(data: OrderStatusUpdateParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/order/status',
    data,
    token: true,
  })
}

export function showOrderApi(id: string): Promise<IResponse<OrderShowData & CommonField>> {
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

export function createOrderShipmentApi(
  params: OrderShipmentParams,
): Promise<IResponse<TableResponse<OrderData & CommonField>>> {
  return request.post({
    url: 'system/order/shipment',
    data: params,
    token: true,
  })
}
