import request from '@/utils/axios'

/**
 * 新增供应商
 * @param {object} params 新增供应商请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.supplierName Supplier Name
 * @param {string} params.supplierDescription Supplier Description
 * @param {string} params.supplierFileId Supplier File ID
 * @returns
 */
export function createSupplierApi(params: CreateSupplierParams): Promise<IResponse<CreateSupplierRes & CommonField>> {
  return request.post({
    url: 'system/supplier',
    data: params,
    token: true,
  })
}

export function createSupplierSlugApi(params: CreateSupplierSlugParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/slug',
    data: params,
    token: true,
  })
}

/**
 * 删除供应商
 * @param {object} params 删除供应商请求参数
 * @param {Array} params.supplierIds Supplier Ids
 * @returns
 */
export function removeSupplierApi(params: RemoveSupplierParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/supplier',
    data: params,
    token: true,
  })
}

/**
 * 新增供应商描述
 * @param {object} params 新增供应商请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.supplierName Supplier Name
 * @param {string} params.supplierDescription Supplier Description
 * @param {string} params.supplierFileId Supplier File ID
 * @returns
 */
export function createSupplierDetailApi(params: CreateSupplierDetailParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/detail',
    data: params,
    token: true,
  })
}

/**
 * 删除供应商文件
 * @param {object} params 删除供应商文件请求参数
 * @param {string} params.supplierDetailId Supplier Detail ID
 * @returns
 */
export function removeSupplierFileApi(params: RemoveSupplierFileParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/detail/remove/supplier/file',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商描述
 * @param {object} params 更新供应商描述请求参数
 * @param {string} params.supplierDetailId Supplier Detail ID
 * @param {string} params.supplierName Supplier Name
 * @param {string} params.supplierDescription Supplier Description
 * @param {string} params.supplierFileId Supplier File ID
 * @returns
 */
export function updateSupplierDetailApi(params: UpdateSupplierDetailParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/detail/update',
    data: params,
    token: true,
  })
}

export function updateSupplierCodeApi(
  params: UpdateSupplierCodeParams,
): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/update/code',
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
): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/detail/update/supplier/description',
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
): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/detail/update/supplier/file',
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
): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/detail/update/supplier/name',
    data: params,
    token: true,
  })
}

/**
 * 供应商列表 - 不带分页
 * @param {object} params 分类列表请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.supplierId Supplier Id
 * @param {string} params.supplierName 供应商标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function supplierListApi(params: SupplierListParams): Promise<IResponse<TableResponse<SupplierListData & CommonField>>> {
  return request.post({
    url: 'system/supplier/list',
    data: params,
    token: true,
  })
}

/**
 * 供应商列表 - 带分页
 * @param {object} params 供应商分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.languageId Language ID
 * @param {string} params.supplierId Supplier Id
 * @param {string} params.supplierName 供应商标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function supplierPaginationApi(
  params: SupplierListParams & Pagination,
): Promise<IResponse<TableResponse<SupplierListData & CommonField>>> {
  return request.post({
    url: 'system/supplier/pagination',
    data: params,
    token: true,
  })
}

/**
 * 新增供应商SEO
 * @param {object} params 新增供应商SEO请求参数
 * @param {string} params.supplierId Supplier ID
 * @param {string} params.languageId Language ID
 * @param {string} params.metaTitle Supplier Meta Title
 * @param {string} params.metaDescription Supplier Meta Description
 * @returns
 */
export function createSupplierSeoApi(params: CreateSupplierSeoParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/seo',
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
export function updateSupplierSeoApi(params: UpdateSupplierSeoParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/seo/update',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商SEO-Meta Description
 * @param {object} params 更新供应商SEO元描述请求参数
 * @param {string} params.supplierSeoId Supplier SEO ID
 * @param {string} params.metaDescription Supplier Meta Description
 * @returns
 */
export function updateSupplierSeoMetaDescriptionApi(
  params: UpdateSupplierSeoMetaDescriptionParams,
): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/seo/update/meta/description',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商SEO-Meta Title
 * @param {object} params 更新供应商SEO元标题请求参数
 * @param {string} params.supplierSeoId Supplier SEO ID
 * @param {string} params.metaTitle Supplier Meta Title
 * @returns
 */
export function updateSupplierSeoMetaTitleApi(
  params: UpdateSupplierSeoMetaTitleParams,
): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/seo/update/meta/title',
    data: params,
    token: true,
  })
}

/**
 * 查看供应商
 * @param {object} params 供应商详情请求参数
 * @param {string} params.supplierId Supplier Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showSupplierApi(params: ShowSupplierParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/show',
    data: params,
    token: true,
  })
}

/**
 * 更新供应商是否自定义布局
 * @param {object} params 修改供应商是否自定义布局请求参数
 * @param {string} params.supplierId Supplier ID
 * @param {boolean} params.isCustomLayout Is Custom Layout
 * @param {string} params.layoutId Layout ID
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateSupplierLayoutApi(params: UpdateSupplierLayoutParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/update/layout',
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
export function updateSupplierSlugApi(params: UpdateSupplierSlugParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/update/slug',
    data: params,
    token: true,
  })
}

export function updateSupplierStatusApi(params: UpdateSupplierStatusParams): Promise<IResponse<SupplierShow & CommonField>> {
  return request.post({
    url: 'system/supplier/update/status',
    data: params,
    token: true,
  })
}
