import request from '@/utils/axios'

export function updateProductAgeGroupTypeApi(
  params: UpdateProductAgeGroupTypeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/age/group/type',
    data: params,
    token: true,
  })
}

export function updateProductBrandApi(params: UpdateProductBrandParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/brand/id',
    data: params,
    token: true,
  })
}

export function updateProductCategoryApi(params: UpdateProductCategoryParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/category',
    data: params,
    token: true,
  })
}

export function updateProductConditionTypeApi(
  params: UpdateProductConditionTypeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/condition/type',
    data: params,
    token: true,
  })
}

export function updateProductFileApi(params: UpdateProductFileParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/file',
    data: params,
    token: true,
  })
}

export function updateProductGenderTypeApi(
  params: UpdateProductGenderTypeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/gender/type',
    data: params,
    token: true,
  })
}

export function updateProductIsAdultApi(params: UpdateProductIsAdultParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/is/adult',
    data: params,
    token: true,
  })
}

export function updateProductIsTopApi(params: UpdateProductIsTopParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/is/top',
    data: params,
    token: true,
  })
}

export function updateProductCustomsApi(params: UpdateProductCustomsParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/customs',
    data: params,
    token: true,
  })
}

export function updateProductLayoutApi(params: UpdateProductLayoutParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/layout',
    data: params,
    token: true,
  })
}

export function updateProductParameterApi(
  params: UpdateProductParameterParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/parameter',
    data: params,
    token: true,
  })
}

export function updateProductDescriptionApi(
  params: UpdateProductDescriptionParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/description',
    data: params,
    token: true,
  })
}

export function updateProductMetaDescriptionApi(
  params: UpdateProductMetaDescriptionParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/meta/description',
    data: params,
    token: true,
  })
}

export function updateProductMetaTitleApi(
  params: UpdateProductMetaTitleParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/meta/title',
    data: params,
    token: true,
  })
}

export function updateProductNameApi(params: UpdateProductNameParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/name',
    data: params,
    token: true,
  })
}

export function updateProductShortDescriptionApi(
  params: UpdateProductShortDescriptionParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/short/description',
    data: params,
    token: true,
  })
}

export function updateProductShortNameApi(
  params: UpdateProductShortNameParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/short/name',
    data: params,
    token: true,
  })
}

export function updateProductSkuApi(
  params: UpdateProductSkuParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/sku',
    data: params,
    token: true,
  })
}

export function updateProductSourceTypeApi(
  params: UpdateProductSourceTypeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/source/type',
    data: params,
    token: true,
  })
}

export function updateProductSupplierApi(params: UpdateProductSupplierParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/supplier/multi',
    data: params,
    token: true,
  })
}

export function updateProductSystemCategoryApi(
  params: UpdateProductSystemCategoryParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/system/category',
    data: params,
    token: true,
  })
}

export function updateProductRelatedApi(params: UpdateProductRelatedParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/related',
    data: params,
    token: true,
  })
}

export function updateProductSlugApi(params: UpdateProductSlugParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/slug',
    data: params,
    token: true,
  })
}

export function updateProductSortApi(params: UpdateProductSortParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/sort',
    data: params,
    token: true,
  })
}

export function updateProductSpuApi(params: UpdateProductSpuParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/spu',
    data: params,
    token: true,
  })
}

export function updateProductStatusApi(params: UpdateProductStatusParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/status',
    data: params,
    token: true,
  })
}

export function updateProductStockStatusApi(params: UpdateProductStockStatusParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/stock/status',
    data: params,
    token: true,
  })
}
