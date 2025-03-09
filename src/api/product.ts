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
export function createProductApi(params: CreateProductParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product',
    data: params,
    token: true,
  })
}

/**
 * 新增产品详情
 * @param {object} params 新增产品名称请求参数
 * @param {string} params.productId Product ID
 * @param {string} params.languageId Language ID
 * @param {string} params.productName Product Name
 * @param {string} params.productShortDescription Product Short Description
 * @param {string} params.productDescription Product Description
 * @returns
 */
export function createProductDetailApi(
  params: CreateProductDetailParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/create/product/detail',
    data: params,
    token: true,
  })
}

/**
 * 新增产品Seo
 * @param {object} params 新增产品SEO请求参数
 * @param {string} params.productId Product ID
 * @param {string} params.languageId Language ID
 * @param {string} params.metaTitle Meta Title
 * @param {string} params.metaDescription Meta Description
 * @returns
 */
export function createProductSeoApi(
  params: CreateProductSeoParams,
): Promise<IResponse<CreateProductRes & CommonField>> {
  return request.post({
    url: 'system/product/create/product/seo',
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
export function removeProductApi(params: RemoveProductParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/product',
    data: params,
    token: true,
  })
}

/**
 * 设置产品分类
 * @param {object} params 修改产品分类请求参数
 * @param {string} params.productId Product ID
 * @param {Array} params.categoryIds Category Ids
 * @param {Array} params.deletedCategoryIds Deleted Category Ids
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductCategoryApi(
  params: UpdateProductCategoryParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/category',
    data: params,
    token: true,
  })
}

/**
 * 设置产品图片
 * @param {object} params 修改产品分类请求参数
 * @param {string} params.productId Product ID
 * @param {number} params.productFileType Product File Type
 * @param {Array} params.fileIds File Ids
 * @param {Array} params.deletedFileIds Deleted File Ids
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductImageApi(params: UpdateProductImageParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/image',
    data: params,
    token: true,
  })
}

/**
 * 设置产品在库库存
 * @param {object} params 修改产品inStockQuantity请求参数
 * @param {string} params.productId Product ID
 * @param {number} params.inStockQuantity In Stock Quantity
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductInStockQuantityApi(
  params: UpdateProductInStockQuantityParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/instock/quantity',
    data: params,
    token: true,
  })
}

/**
 * 设置产品是否设置下线时间
 * @param {object} params 修改产品IsSettingOnlineTime请求参数
 * @param {string} params.productId Product ID
 * @param {boolean} params.isSettingOfflineTime Is Setting Offline Time
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductIsSettingOfflineTimeApi(
  params: UpdateProductIsSettingOfflineTimeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/is/setting/offline/time',
    data: params,
    token: true,
  })
}

/**
 * 修改产品是否设置上线时间
 * @param {object} params 修改产品IsSettingOnlineTime请求参数
 * @param {string} params.productId Product ID
 * @param {boolean} params.isSettingOnlineTime Is Setting Online Time
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductIsSettingOnlineTimeApi(
  params: UpdateProductIsSettingOnlineTimeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/is/setting/online/time',
    data: params,
    token: true,
  })
}

/**
 * 修改产品MPN
 * @param {object} params 修改产品MPN请求参数
 * @param {string} params.productId Product ID
 * @param {string} params.mpn MPN
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductMpnApi(params: UpdateProductMpnParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/mpn',
    data: params,
    token: true,
  })
}

/**
 * 设置产品下线时间
 * @param {object} params 修改产品OfflineTime请求参数
 * @param {string} params.productId Product ID
 * @param {object} params.offlineTime Offline Time
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductOfflineTimeApi(
  params: UpdateProductOfflineTimeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/offline/time',
    data: params,
    token: true,
  })
}

/**
 * 设置产品上线时间
 * @param {object} params 修改产品OnlineTime请求参数
 * @param {string} params.productId Product ID
 * @param {object} params.onlineTime Online Time
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductOnlineTimeApi(
  params: UpdateProductOnlineTimeParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/online/time',
    data: params,
    token: true,
  })
}

/**
 * 设置产品参数
 * @param {object} params 修改产品参数请求参数
 * @param {string} params.productId Product ID
 * @param {Array} params.productParameterRelationRequestDos Product Parameter Relation Request Dos
 * @param {Array} params.deletedProductParameterIds Deleted Product Parameter Ids
 * @param {string} params.parameterGroupId Parameter GroupId
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductParameterApi(
  params: UpdateProductParameterParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/parameter',
    data: params,
    token: true,
  })
}

/**
 * 设置产品价格
 * @param {object} params 修改产品价格请求参数
 * @param {string} params.productId Product ID
 * @param {Array} params.productPriceUpdateRequestDos Product Price Update Request Dos
 * @param {Array} params.deletedPriceIds Deleted Price Ids
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductPriceApi(params: UpdateProductPriceParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/price',
    data: params,
    token: true,
  })
}

/**
 * 设置产品生产时间天数
 * @param {object} params 修改产品ProcessingDays请求参数
 * @param {string} params.productId Product ID
 * @param {number} params.processingDays Processing Days
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductProcessingDaysApi(
  params: UpdateProductProcessingDaysParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/processing/days',
    data: params,
    token: true,
  })
}

/**
 * 设置产品生产库存
 * @param {object} params 修改产品ProcessingQuantity请求参数
 * @param {string} params.productId Product ID
 * @param {number} params.processingQuantity Processing Quantity
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductProcessingQuantityApi(
  params: UpdateProductProcessingQuantityParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/processing/quantity',
    data: params,
    token: true,
  })
}

/**
 * 设置产品生产周期
 * @param {object} params 修改产品ProductionCycle请求参数
 * @param {string} params.productId Product ID
 * @param {number} params.productionCycle ProductionCycle
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductProductionCycleApi(
  params: UpdateProductProductionCycleParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/production/cycle',
    data: params,
    token: true,
  })
}

/**
 * 修改产品sku
 * @param {object} params 修改产品SKU请求参数
 * @param {string} params.productId Product ID
 * @param {string} params.sku SKU
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductSkuApi(params: UpdateProductSkuParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/sku',
    data: params,
    token: true,
  })
}

/**
 * 设置产品状态
 * @param {object} params 修改产品状态请求参数
 * @param {string} params.productId Product ID
 * @param {boolean} params.status Status
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductStatusApi(
  params: UpdateProductStatusParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/status',
    data: params,
    token: true,
  })
}

/**
 * 设置产品供应商
 * @param {object} params 修改产品供应商请求参数
 * @param {string} params.productId Product ID
 * @param {string} params.supplierId Supplier ID
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateProductSupplierApi(
  params: UpdateProductSupplierParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/supplier',
    data: params,
    token: true,
  })
}

/**
 * 修改产品名称
 * @param {object} params 修改产品名称请求参数
 * @param {string} params.productDetailId Product Detail ID
 * @param {string} params.productName Product Name
 * @returns
 */
export function updateProductNameApi(params: UpdateProductNameParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/name',
    data: params,
    token: true,
  })
}

/**
 * 修改产品描述
 * @param {object} params 修改产品详情请求参数
 * @param {string} params.productDetailId Product Detail ID
 * @param {string} params.productDescription Product Description
 * @returns
 */
export function updateProductDescriptionApi(
  params: UpdateProductDescriptionParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/description',
    data: params,
    token: true,
  })
}

/**
 * 修改产品简短描述
 * @param {object} params 修改产品简短描述请求参数
 * @param {string} params.productDetailId Product Detail ID
 * @param {string} params.productShortDescription Product ShortDescription
 * @returns
 */
export function updateProductShortDescriptionApi(
  params: UpdateProductShortDescriptionParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/short/description',
    data: params,
    token: true,
  })
}

/**
 * 修改产品元标题
 * @param {object} params 修改产品元标题请求参数
 * @param {string} params.productSeoId Product Seo ID
 * @param {string} params.metaTitle Meta Title
 * @returns
 */
export function updateProductMetaTitleApi(
  params: UpdateProductMetaTitleParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/meta/title',
    data: params,
    token: true,
  })
}

/**
 * 修改产品元描述
 * @param {object} params 修改产品元描述请求参数
 * @param {string} params.productSeoId Product Seo ID
 * @param {string} params.metaDescription Meta Description
 * @returns
 */
export function updateProductMetaDescriptionApi(
  params: UpdateProductMetaDescriptionParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/update/product/meta/description',
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

export function productExportListApi(
  params: ProductListParams,
): Promise<IResponse<TableResponse<ProductExportListData & CommonField>>> {
  return request.post({
    url: 'system/product/export',
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
