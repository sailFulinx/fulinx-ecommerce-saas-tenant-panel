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

export function createBrandSlugApi(params: CreateBrandSlugParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/slug',
    data: params,
    token: true,
  })
}

/**
 * 删除品牌
 * @param {object} params 删除品牌请求参数
 * @param {Array} params.brandIds Brand Ids
 * @returns
 */
export function removeBrandApi(params: RemoveBrandParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/brand',
    data: params,
    token: true,
  })
}

/**
 * 新增品牌描述
 * @param {object} params 新增品牌请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.brandName Brand Name
 * @param {string} params.brandDescription Brand Description
 * @param {string} params.brandFileId Brand File ID
 * @returns
 */
export function createBrandDetailApi(params: CreateBrandDetailParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/detail',
    data: params,
    token: true,
  })
}

/**
 * 删除品牌文件
 * @param {object} params 删除品牌文件请求参数
 * @param {string} params.brandDetailId Brand Detail ID
 * @returns
 */
export function removeBrandFileApi(params: RemoveBrandFileParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/detail/remove/brand/file',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌描述
 * @param {object} params 更新品牌描述请求参数
 * @param {string} params.brandDetailId Brand Detail ID
 * @param {string} params.brandName Brand Name
 * @param {string} params.brandDescription Brand Description
 * @param {string} params.brandFileId Brand File ID
 * @returns
 */
export function updateBrandDetailApi(params: UpdateBrandDetailParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/detail/update',
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
): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/detail/update/brand/description',
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
): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/detail/update/brand/file',
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
): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/detail/update/brand/name',
    data: params,
    token: true,
  })
}

/**
 * 品牌列表 - 不带分页
 * @param {object} params 分类列表请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.brandId Brand Id
 * @param {string} params.brandName 品牌标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function brandListApi(params: BrandListParams): Promise<IResponse<TableResponse<BrandListData & CommonField>>> {
  return request.post({
    url: 'system/brand/list',
    data: params,
    token: true,
  })
}

/**
 * 品牌列表 - 带分页
 * @param {object} params 品牌分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.languageId Language ID
 * @param {string} params.brandId Brand Id
 * @param {string} params.brandName 品牌标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function brandPaginationApi(
  params: BrandListParams & Pagination,
): Promise<IResponse<TableResponse<BrandListData & CommonField>>> {
  return request.post({
    url: 'system/brand/pagination',
    data: params,
    token: true,
  })
}

/**
 * 新增品牌SEO
 * @param {object} params 新增品牌SEO请求参数
 * @param {string} params.brandId Brand ID
 * @param {string} params.languageId Language ID
 * @param {string} params.metaTitle Brand Meta Title
 * @param {string} params.metaDescription Brand Meta Description
 * @returns
 */
export function createBrandSeoApi(params: CreateBrandSeoParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/seo',
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
export function updateBrandSeoApi(params: UpdateBrandSeoParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/seo/update',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌SEO-Meta Description
 * @param {object} params 更新品牌SEO元描述请求参数
 * @param {string} params.brandSeoId Brand SEO ID
 * @param {string} params.metaDescription Brand Meta Description
 * @returns
 */
export function updateBrandSeoMetaDescriptionApi(params: UpdateBrandSeoMetaDescriptionParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/seo/update/meta/description',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌SEO-Meta Title
 * @param {object} params 更新品牌SEO元标题请求参数
 * @param {string} params.brandSeoId Brand SEO ID
 * @param {string} params.metaTitle Brand Meta Title
 * @returns
 */
export function updateBrandSeoMetaTitleApi(params: UpdateBrandSeoMetaTitleParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/seo/update/meta/title',
    data: params,
    token: true,
  })
}

/**
 * 查看品牌
 * @param {object} params 品牌详情请求参数
 * @param {string} params.brandId Brand Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showBrandApi(params: ShowBrandParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/show',
    data: params,
    token: true,
  })
}

/**
 * 更新品牌是否自定义布局
 * @param {object} params 修改品牌是否自定义布局请求参数
 * @param {string} params.brandId Brand ID
 * @param {boolean} params.isCustomLayout Is Custom Layout
 * @param {string} params.layoutId Layout ID
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateBrandLayoutApi(
  params: UpdateBrandLayoutParams,
): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/update/layout',
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
export function updateBrandSlugApi(params: UpdateBrandSlugParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/update/slug',
    data: params,
    token: true,
  })
}

export function updateBrandStatusApi(params: UpdateBrandStatusParams): Promise<IResponse<BrandShow & CommonField>> {
  return request.post({
    url: 'system/brand/update/status',
    data: params,
    token: true,
  })
}
