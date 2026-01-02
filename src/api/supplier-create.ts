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

export function createSupplierNameApi(params: CreateSupplierNameParams): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/create/name',
    data: params,
    token: true,
  })
}

export function createSupplierSeoApi(
  params: CreateSupplierSeoParams,
): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/create/seo',
    data: params,
    token: true,
  })
}

export function createSupplierSlugApi(params: CreateSupplierSlugParams): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/slug',
    data: params,
    token: true,
  })
}
