import request from '@/utils/axios'

export function updateBrandDetailCustomApi(
  params: UpdateBrandDetailCustomParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/detail/customs',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌描述详情
 * @param {object} params 更新品牌描述详情请求参数
 * @param {string} params.brandDetailId Brand Detail ID
 * @param {string} params.brandDescription Brand Description
 * @returns
 */
export function updateBrandDetailDescriptionApi(
  params: UpdateBrandDetailDescriptionParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/detail/description',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌描述文件
 * @param {object} params 更新品牌描述文件请求参数
 * @param {string} params.brandDetailId Brand Detail ID
 * @param {string} params.brandFileId Brand File ID
 * @returns
 */
export function updateBrandDetailFileApi(
  params: UpdateBrandDetailFileParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/detail/file',
    data: params,
    token: true,
  })
}

export function updateBrandDetailLayoutApi(
  params: UpdateBrandDetailLayoutParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/detail/layout',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌描述名称
 * @param {object} params 更新品牌描述品牌名称请求参数
 * @param {string} params.brandDetailId Brand Detail ID
 * @param {string} params.brandName Brand Name
 * @returns
 */
export function updateBrandDetailBrandNameApi(
  params: UpdateBrandDetailBrandNameParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/detail/name',
    data: params,
    token: true,
  })
}

export function updateBrandDetailBrandShortDescriptionApi(
  params: UpdateBrandDetailBrandShortDescriptionParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/detail/short/description',
    data: params,
    token: true,
  })
}

export function updateBrandDetailBrandShortNameApi(
  params: UpdateBrandDetailBrandShortNameParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/detail/short/name',
    data: params,
    token: true,
  })
}

export function updateBrandIsTopApi(params: UpdateBrandIsTopParams): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/is/top',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌SEO
 * @param {object} params 更新品牌SEO请求参数
 * @param {string} params.brandSeoId Brand SEO ID
 * @param {string} params.metaTitle Brand Meta Title
 * @param {string} params.metaDescription Brand Meta Description
 * @returns
 */
export function updateBrandSeoApi(params: UpdateBrandSeoParams): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/seo',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌SLUG
 * @param {object} params 修改品牌SLUG请求参数
 * @param {string} params.slugId Slug ID
 * @param {string} params.languageId Language ID
 * @param {string} params.slug Slug
 * @returns
 */
export function updateBrandSlugApi(params: UpdateBrandSlugParams): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/slug',
    data: params,
    token: true,
  })
}

export function updateBrandSortApi(
  params: UpdateBrandSortParams,
): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/sort',
    data: params,
    token: true,
  })
}

export function updateBrandStatusApi(params: UpdateBrandStatusParams): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/update/status',
    data: params,
    token: true,
  })
}
