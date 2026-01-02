import request from '@/utils/axios'

/**
 * 新增品牌
 * @param {object} params 新增品牌请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.brandName Brand Name
 * @param {string} params.brandDescription Brand Description
 * @param {string} params.brandFileId Brand File ID
 * @returns
 */
export function createBrandApi(params: CreateBrandParams): Promise<IResponse<CreateBrandRes & CommonField>> {
  return request.post({
    url: 'system/brand',
    data: params,
    token: true,
  })
}

export function createBrandNameApi(params: CreateBrandNameParams): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/create/name',
    data: params,
    token: true,
  })
}

export function createBrandSeoApi(
  params: CreateBrandSeoParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/create/seo',
    data: params,
    token: true,
  })
}

export function createBrandSlugApi(params: CreateBrandSlugParams): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/slug',
    data: params,
    token: true,
  })
}
