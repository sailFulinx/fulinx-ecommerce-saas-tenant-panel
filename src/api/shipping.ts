import request from '@/utils/axios'

/**
 * 新增快递公司
 * @param {object} params ShippingCompanyCreateVo
 * @param {string} params.shippingCompanyName Shipping Company Name
 * @returns
 */
export function createShippingCompanyApi(
  params: CreateShippingCompanyParams,
): Promise<IResponse<CreateShippingCompanyRes & CommonField>> {
  return request.post({
    url: 'system/shipping/company',
    data: params,
    token: true,
  })
}

/**
 * 删除快递公司
 * @param {object} params ShippingCompanyDeleteVo
 * @param {Array} params.ids Shipping Company Ids
 * @returns
 */
export function removeShippingCompanyApi(params: RemoveShippingCompanyParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/shipping/company',
    data: params,
    token: true,
  })
}

/**
 * 修改快递公司
 * @param {object} params ShippingCompanyUpdateVo
 * @param {string} params.shippingCompanyId Shipping Company ID
 * @param {string} params.shippingCompanyName Shipping Company Name
 * @returns
 */
export function updateShippingCompanyApi(params: UpdateShippingCompanyParams): Promise<IResponse<boolean>> {
  return request.put({
    url: 'system/shipping/company',
    data: params,
    token: true,
  })
}

/**
 * 快递公司列表- 不带分页
 * @param {object} params 快递公司列表询参数
 * @param {string} params.id Shipping Company ID
 * @param {string} params.shippingCompanyName Shipping Company Name
 * @param {number} params.isDelete Soft Delete Flag
 * @returns
 */
export function shippingCompanyListApi(
  params: ShippingCompanyListParams,
): Promise<IResponse<TableResponse<ShippingCompanyListData & CommonField>>> {
  return request.post({
    url: 'system/shipping/company/list',
    data: params,
    token: true,
  })
}

/**
 * 快递公司列表- 带分页
 * @param {object} params 快递公司分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.id Shipping Company ID
 * @param {string} params.shippingCompanyName Shipping Company Name
 * @param {number} params.isDelete Soft Delete Flag
 * @returns
 */
export function shippingCompanyPaginationApi(
  params: ShippingCompanyListParams & Pagination,
): Promise<IResponse<TableResponse<ShippingCompanyListData & CommonField>>> {
  return request.post({
    url: 'system/shipping/company/pagination',
    data: params,
    token: true,
  })
}

/**
 * 查看快递公司
 * @param {string} id
 * @returns
 */
export function showShippingCompanyApi(id: string): Promise<IResponse<ShippingCompanyShow & CommonField>> {
  return request.get({
    url: `system/shipping/company/${id}`,
    token: true,
  })
}

/**
 * 新增快递公司模板
 * @param {object} params ShippingCompanyTemplateCreateVo
 * @param {string} params.shippingCompanyTemplateName Shipping Company Name
 * @returns
 */
export function createShippingCompanyTemplateApi(
  params: CreateShippingCompanyTemplateParams,
): Promise<IResponse<CreateShippingCompanyTemplateRes & CommonField>> {
  return request.post({
    url: 'system/shipping/company/template',
    data: params,
    token: true,
  })
}

/**
 * 删除快递公司模板
 * @param {object} params ShippingCompanyTemplateDeleteVo
 * @param {Array} params.ids Shipping Company Ids
 * @returns
 */
export function removeShippingCompanyTemplateApi(
  params: RemoveShippingCompanyTemplateParams,
): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/shipping/company/template',
    data: params,
    token: true,
  })
}

/**
 * 修改快递公司模板
 * @param {object} params ShippingCompanyTemplateUpdateVo
 * @param {string} params.shippingCompanyTemplateId Shipping Company ID
 * @param {string} params.shippingCompanyTemplateName Shipping Company Name
 * @returns
 */
export function updateShippingCompanyTemplateApi(
  params: UpdateShippingCompanyTemplateParams,
): Promise<IResponse<boolean>> {
  return request.put({
    url: 'system/shipping/company/template',
    data: params,
    token: true,
  })
}

/**
 * 快递公司模板列表- 不带分页
 * @param {object} params 快递公司模板列表询参数
 * @param {string} params.id Shipping Company ID
 * @param {string} params.shippingCompanyTemplateName Shipping Company Name
 * @param {number} params.isDelete Soft Delete Flag
 * @returns
 */
export function shippingCompanyTemplateListApi(
  params: ShippingCompanyTemplateListParams,
): Promise<IResponse<TableResponse<ShippingCompanyTemplateListData & CommonField>>> {
  return request.post({
    url: 'system/shipping/company/template/list',
    data: params,
    token: true,
  })
}

/**
 * 快递公司模板列表- 带分页
 * @param {object} params 快递公司模板分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.id Shipping Company ID
 * @param {string} params.shippingCompanyTemplateName Shipping Company Name
 * @param {number} params.isDelete Soft Delete Flag
 * @returns
 */
export function shippingCompanyTemplatePaginationApi(
  params: ShippingCompanyTemplateListParams & Pagination,
): Promise<IResponse<TableResponse<ShippingCompanyTemplateListData & CommonField>>> {
  return request.post({
    url: 'system/shipping/company/template/pagination',
    data: params,
    token: true,
  })
}

/**
 * 查看快递公司模板
 * @param {string} id
 * @returns
 */
export function showShippingCompanyTemplateApi(
  id: string,
): Promise<IResponse<ShippingCompanyTemplateShow & CommonField>> {
  return request.post({
    url: `system/shipping/company/template/show/${id}`,
    token: true,
  })
}
