export function regionCountryListApi(
  data?: RegionCountryListParams,
): Promise<IResponse<TableResponse<RegionCountryListData & CommonField>>> {
  return request.post({
    url: 'share/public/region/country/list',
    data,
    token: true,
  })
}

export function regionStateListApi(
  data?: RegionStateListParams,
): Promise<IResponse<TableResponse<RegionStateListData & CommonField>>> {
  return request.post({
    url: 'share/public/region/state/list',
    data,
    token: true,
  })
}

export function regionCityListApi(
  data?: RegionCityListParams,
): Promise<IResponse<TableResponse<RegionCityListData & CommonField>>> {
  return request.post({
    url: 'share/public/region/city/list',
    data,
    token: true,
  })
}
