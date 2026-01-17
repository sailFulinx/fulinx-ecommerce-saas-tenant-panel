export function fetchLayoutTypeListApi(data?: ListLayoutTypeParams): Promise<IResponse<TableResponse<LayoutTypeData>>> {
  return request.post({
    url: 'share/public/common/layout/type/list',
    data,
  })
}

export function fetchArticleTypeListApi(
  data?: ArticleTypeListParams,
): Promise<IResponse<TableResponse<ArticleTypeData>>> {
  return request.post({
    url: 'share/public/common/article/type/list',
    data,
  })
}

export function fetchProductTypeListApi(
  data?: ProductTypeListParams,
): Promise<IResponse<TableResponse<ProductTypeData>>> {
  return request.post({
    url: 'share/public/common/product/type/list',
    data,
  })
}

export function fetchProductSourceTypeListApi(
  data?: ProductSourceTypeListParams,
): Promise<IResponse<TableResponse<ProductSourceTypeData>>> {
  return request.post({
    url: 'share/public/common/product/source/type/list',
    data,
  })
}

export function fetchAgeGroupTypeListApi(
  data?: AgeGroupTypeListParams,
): Promise<IResponse<TableResponse<AgeGroupTypeData>>> {
  return request.post({
    url: 'share/public/common/age/group/type/list',
    data,
  })
}

export function fetchConditionTypeListApi(
  data?: ConditionTypeListParams,
): Promise<IResponse<TableResponse<ConditionTypeData>>> {
  return request.post({
    url: 'share/public/common/condition/type/list',
    data,
  })
}

export function fetchGenderTypeListApi(data?: GenderTypeListParams): Promise<IResponse<TableResponse<GenderTypeData>>> {
  return request.post({
    url: 'share/public/common/gender/type/list',
    data,
  })
}

export function fetchWarehouseTypeListApi(
  data?: WarehouseTypeListParams,
): Promise<IResponse<TableResponse<WarehouseTypeData>>> {
  return request.post({
    url: 'share/public/common/warehouse/type/list',
    data,
  })
}

export function fetchProductStockStatusListApi(
  data?: ProductStockStatusListParams,
): Promise<IResponse<TableResponse<ProductStockStatusData>>> {
  return request.post({
    url: 'share/public/common/stock/status/list',
    data,
  })
}

export function fetchWeightUnitListApi(data?: CommonEnumListParams): Promise<IResponse<TableResponse<CommonEnumData>>> {
  return request.post({
    url: 'share/public/common/weight/unit/list',
    data,
  })
}

export function fetchLengthUnitListApi(data?: CommonEnumListParams): Promise<IResponse<TableResponse<CommonEnumData>>> {
  return request.post({
    url: 'share/public/common/length/unit/list',
    data,
  })
}
