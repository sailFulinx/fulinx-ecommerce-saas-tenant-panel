import request from '@/utils/axios'

/**
 * 新增产品
 * @param {object} params 新增产品请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.spu SPU
 * @param {number} params.productType Product Type: 1-physical,2-Virtual
 * @param {object} params.onlineTime Online Time
 * @param {object} params.offlineTime Offline Time
 * @param {string} params.brandId Brand ID
 * @param {number} params.productSourceType Product Source Type, 1-own, 2-oem, 3-agency, 4-drop, 5-other
 * @param {boolean} params.isAdult Is Adult,  0 - No, 1 - Yes
 * @param {number} params.ageGroupType Age Group Type, 1-newborn,2-infant,3-toddler,4-kids,5-adult
 * @param {number} params.genderType Gender Type, 1-male,2-female,3-unisex
 * @param {number} params.conditionType Condition Type, 1-new,2-refurbished,3-used
 * @param {string} params.systemCategoryId System Category ID
 * @param {string} params.productName Product Name
 * @param {string} params.productShortName Product Short Name
 * @param {string} params.productDescription Product Description
 * @param {string} params.productShortDescription Product Short Description
 * @param {string} params.metaTitle Meta Title
 * @param {string} params.metaDescription Meta Keywords
 * @param {Array} params.categoryIds Category Ids
 * @param {Array} params.productFileRequestDos Product Files
 * @param {string} params.currencyId Currency ID
 * @param {object} params.productSkuRequestDo Product Sku Request Do
 * @param {Array} params.productParameterRelationRequestDos Product Parameter Relation Request Dos
 * @param {Array} params.productRelatedRequestDos Product Related Request Dos
 * @param {Array} params.productSupplierRequestDos Product Supplier Request Dos
 * @returns
 */
export function createProductApi(params: CreateProductParams): Promise<IResponse<CreateProductRes & CommonField>> {
  return request.post({
    url: 'system/product',
    data: params,
    token: true,
  })
}

export function createProductNameApi(params: CreateProductNameParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/create/product/name',
    data: params,
    token: true,
  })
}

export function createProductSeoApi(params: CreateProductSeoParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/create/product/seo',
    data: params,
    token: true,
  })
}

export function createProductSkuApi(params: CreateProductSkuParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/create/product/sku',
    data: params,
    token: true,
  })
}

export function createProductSupplierApi(params: CreateProductSupplierParams): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/create/product/supplier',
    data: params,
    token: true,
  })
}

export function createProductTagApi(
  params: CreateProductTagParams,
): Promise<IResponse<ShowProduct & CommonField>> {
  return request.post({
    url: 'system/product/create/product/tag',
    data: params,
    token: true,
  })
}
