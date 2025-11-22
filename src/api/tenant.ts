export function fetchTenantInfoApi(): Promise<IResponse<TenantDetail>> {
  return request.get({
    url: 'tenant/info',
    token: true,
    isBusinessApi: false,
  })
}
