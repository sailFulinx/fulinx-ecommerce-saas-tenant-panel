import request from '@/utils/axios'

/**
 * 产品列表 - 不带分页
 * @param {object} params 分类列表请求产品
 * @param {string} params.languageId Language ID
 * @param {string} params.productId Product Id
 * @param {string} params.productName Product Name
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function productListApi(
  params: ProductListParams,
): Promise<IResponse<TableResponse<ProductListData & CommonField>>> {
  return request.post({
    url: 'system/product/list',
    data: params,
    token: true,
  })
}

/**
 * 产品列表 - 带分页
 * @param {object} params 产品分页查询产品
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.languageId Language ID
 * @param {string} params.productId Product Id
 * @param {string} params.productName Product Name
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function productPaginationApi(
  params: ProductListParams,
): Promise<IResponse<TableResponse<ProductListData & CommonField>>> {
  return request.post({
    url: 'system/product/pagination',
    data: params,
    token: true,
  })
}

/**
 * 查看产品
 * @param {object} params 产品详情请求产品
 * @param {string} params.productId Product Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showProductApi(params: ShowProductParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/show',
    data: params,
    token: true,
  })
}
