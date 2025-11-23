import request from '@/utils/axios'

export function fetchTenantInfoApi(): Promise<IResponse<TenantDetail>> {
  return request.get({
    url: 'tenant/info',
    token: true,
    isBusinessApi: false,
  })
}

export function createTenantStoreApi(data: TenantStoreCreateParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'tenant/store',
    data,
    token: true,
    isBusinessApi: false,
  })
}

export function updateTenantStoreApi(data: TenantStoreUpdateParams): Promise<IResponse<boolean>> {
  return request.put({
    url: 'tenant/store',
    data,
    token: true,
    isBusinessApi: false,
  })
}

export function removeTenantStoreApi(data: TenantStoreRemoveParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'tenant/store',
    data,
    token: true,
    isBusinessApi: false,
  })
}

export function showTenantStoreApi(params: ShowStoreParams): Promise<IResponse<StoreShowData & CommonField>> {
  return request.post({
    url: 'tenant/store/show',
    data: params,
    token: true,
  })
}

export function tenantStorePaginationApi(
  data: TenantStoreListParams & Pagination,
): Promise<IResponse<TableResponse<TenantStoreListData & CommonField>>> {
  return request.post({
    url: 'tenant/store/pagination',
    data,
    token: true,
  })
}

export function tenantStoreListApi(
  data?: TenantStoreListParams,
): Promise<IResponse<TableResponse<TenantStoreListData & CommonField>>> {
  return request.post({
    url: 'tenant/store/list',
    data,
    token: true,
  })
}
