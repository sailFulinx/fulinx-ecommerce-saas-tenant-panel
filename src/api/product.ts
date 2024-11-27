import request from '@/utils/axios'

/**
 * 新增产品
 * @param {object} params 新增产品请求产品
 * @param {string} params.languageId Language ID
 * @param {string} params.productName Product Name
 * @param {number} params.productPrice Product Price
 * @param {Array} params.productFileRequestDos Product File Request
 * @param {string} params.productDescription Product Description
 * @param {string} params.brandId Brand ID
 * @param {string} params.supplierId Supplier ID
 * @returns
 */
export function createProductApi(
  params: CreateProductParams,
): Promise<IResponse<CreateProductRes & CommonField>> {
  return request.post({
    url: 'system/product',
    data: params,
    token: true,
  })
}

/**
 * 删除产品
 * @param {object} params 删除产品请求产品
 * @param {Array} params.productIds Product Ids
 * @returns
 */
export function removeProductApi(
  params: RemoveProductParams,
): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/product',
    data: params,
    token: true,
  })
}

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
export function showProductApi(
  params: ShowProductParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/show',
    data: params,
    token: true,
  })
}
