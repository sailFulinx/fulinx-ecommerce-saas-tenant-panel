import request from '@/utils/axios'

export function createWarehouseApi(data: CreateWarehouseParams): Promise<IResponse<CreateWarehouseRes & CommonField>> {
  return request.post({
    url: 'system/warehouse',
    data,
    token: true,
  })
}

export function removeWarehouseApi(data: RemoveWarehouseParams): Promise<IResponse<WarehouseData & CommonField>> {
  return request.delete({
    url: 'system/warehouse',
    data,
    token: true,
  })
}

export function editWarehouseApi(id: string, data: UpdateWarehouseParams): Promise<IResponse<WarehouseData & CommonField>> {
  return request.put({
    url: `system/warehouse/${id}`,
    data,
    token: true,
  })
}

export function updateWarehouseStatusApi(data: UpdateWarehouseStatusParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/warehouse/update/status',
    data,
    token: true,
  })
}

export function updateWarehouseIsDefaultApi(data: UpdateWarehouseIsDefaultParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/warehouse/set/default',
    data,
    token: true,
  })
}

export function showWarehouseApi(id: string): Promise<IResponse<WarehouseData & CommonField>> {
  return request.get({
    url: `system/warehouse/${id}`,
    token: true,
  })
}

export function warehousePaginationApi(
  data: WarehouseListParams & Pagination,
): Promise<IResponse<TableResponse<WarehouseData & CommonField>>> {
  return request.post({
    url: 'system/warehouse/pagination',
    data,
    token: true,
  })
}

export function warehouseListApi(
  data: WarehouseListParams,
): Promise<IResponse<TableResponse<WarehouseData & CommonField>>> {
  return request.post({
    url: 'system/warehouse/list',
    data,
    token: true,
  })
}
