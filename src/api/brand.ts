import request from '@/utils/axios'

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
 * 查看品牌
 * @param {object} params 品牌详情请求参数
 * @param {string} params.brandId Brand Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showBrandApi(params: ShowBrandParams): Promise<IResponse<BrandShowData & CommonField>> {
  return request.post({
    url: 'system/brand/show',
    data: params,
    token: true,
  })
}
