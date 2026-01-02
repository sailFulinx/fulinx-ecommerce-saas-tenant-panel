import request from '@/utils/axios'

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
 * 查看供应商
 * @param {object} params 供应商详情请求参数
 * @param {string} params.supplierId Supplier Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showSupplierApi(params: ShowSupplierParams): Promise<IResponse<SupplierShowData & CommonField>> {
  return request.post({
    url: 'system/supplier/show',
    data: params,
    token: true,
  })
}
