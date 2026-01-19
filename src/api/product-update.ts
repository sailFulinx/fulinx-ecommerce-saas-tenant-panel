import request from '@/utils/axios'

export function updateAgeGroupTypeApi(params: UpdateAgeGroupTypeParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/age/group/type',
    data: params,
    token: true,
  })
}

export function updateBrandApi(params: UpdateBrandParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/brand/id',
    data: params,
    token: true,
  })
}

export function updateCategoryApi(params: UpdateCategoryParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/category',
    data: params,
    token: true,
  })
}

export function updateConditionTypeApi(params: UpdateConditionTypeParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/condition/type',
    data: params,
    token: true,
  })
}

export function updateFileApi(params: UpdateFileParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/file',
    data: params,
    token: true,
  })
}

export function updateGenderTypeApi(params: UpdateGenderTypeParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/gender/type',
    data: params,
    token: true,
  })
}

export function updateIsAdultApi(params: UpdateIsAdultParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/is/adult',
    data: params,
    token: true,
  })
}

export function updateIsTopApi(params: UpdateIsTopParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/is/top',
    data: params,
    token: true,
  })
}

export function updateLayoutApi(params: UpdateLayoutParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/layout',
    data: params,
    token: true,
  })
}

export function updateParameterApi(params: UpdateParameterParams): Promise<IResponse<ShowProduct & CommonField>> {
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
