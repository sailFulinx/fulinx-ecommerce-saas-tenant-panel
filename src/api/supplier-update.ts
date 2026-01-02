import request from '@/utils/axios'

export function updateSupplierDetailCustomApi(
  params: UpdateSupplierDetailCustomParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/detail/customs',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商描述详情
 * @param {object} params 更新供应商描述详情请求参数
 * @param {string} params.supplierDetailId Supplier Detail ID
 * @param {string} params.supplierDescription Supplier Description
 * @returns
 */
export function updateSupplierDetailDescriptionApi(
  params: UpdateSupplierDetailDescriptionParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/detail/description',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商描述文件
 * @param {object} params 更新供应商描述文件请求参数
 * @param {string} params.supplierDetailId Supplier Detail ID
 * @param {string} params.supplierFileId Supplier File ID
 * @returns
 */
export function updateSupplierDetailFileApi(
  params: UpdateSupplierDetailFileParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/detail/file',
    data: params,
    token: true,
  })
}

export function updateSupplierDetailLayoutApi(
  params: UpdateSupplierDetailLayoutParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/detail/layout',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商描述名称
 * @param {object} params 更新供应商描述供应商名称请求参数
 * @param {string} params.supplierDetailId Supplier Detail ID
 * @param {string} params.supplierName Supplier Name
 * @returns
 */
export function updateSupplierDetailSupplierNameApi(
  params: UpdateSupplierDetailSupplierNameParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/detail/name',
    data: params,
    token: true,
  })
}

export function updateSupplierDetailSupplierShortDescriptionApi(
  params: UpdateSupplierDetailSupplierShortDescriptionParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/detail/short/description',
    data: params,
    token: true,
  })
}

export function updateSupplierDetailSupplierShortNameApi(
  params: UpdateSupplierDetailSupplierShortNameParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/detail/short/name',
    data: params,
    token: true,
  })
}

export function updateSupplierIsTopApi(params: UpdateSupplierIsTopParams): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/is/top',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商SEO
 * @param {object} params 更新供应商SEO请求参数
 * @param {string} params.supplierSeoId Supplier SEO ID
 * @param {string} params.metaTitle Supplier Meta Title
 * @param {string} params.metaDescription Supplier Meta Description
 * @returns
 */
export function updateSupplierSeoApi(params: UpdateSupplierSeoParams): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/seo',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商SLUG
 * @param {object} params 修改供应商SLUG请求参数
 * @param {string} params.slugId Slug ID
 * @param {string} params.languageId Language ID
 * @param {string} params.slug Slug
 * @returns
 */
export function updateSupplierSlugApi(params: UpdateSupplierSlugParams): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/slug',
    data: params,
    token: true,
  })
}

export function updateSupplierSortApi(
  params: UpdateSupplierSortParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/sort',
    data: params,
    token: true,
  })
}

export function updateSupplierStatusApi(params: UpdateSupplierStatusParams): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/update/status',
    data: params,
    token: true,
  })
}
