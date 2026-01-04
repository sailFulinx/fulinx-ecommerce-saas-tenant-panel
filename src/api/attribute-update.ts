import request from '@/utils/axios'

/**
 * 更新属性名称
 * @param {object} params 更新属性描述属性名称请求参数
 * @param {string} params.attributeDetailId Attribute Detail ID
 * @param {string} params.attributeName Attribute Name
 * @returns
 */
export function updateAttributeNameApi(
  params: UpdateAttributeNameParams,
): Promise<IResponse<AttributeShowData & CommonField>> {
  return request.post({
    url: 'system/attribute/update/detail/name',
    data: params,
    token: true,
  })
}

/**
 * 更新属性排序
 * @param {object} params 更新属性排序请求参数
 * @param {string} params.attributeId Attribute ID
 * @param {string} params.languageId Language ID
 * @param {number} params.sort Sort
 * @returns
 */
export function updateAttributeSortApi(
  params: UpdateAttributeSortParams,
): Promise<IResponse<AttributeShowData & CommonField>> {
  return request.post({
    url: 'system/attribute/update/sort',
    data: params,
    token: true,
  })
}

/**
 * 更新属性状态
 * @param {object} params 修改属性状态请求参数
 * @param {string} params.attributeId Attribute ID
 * @param {boolean} params.status Status
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateAttributeStatusApi(
  params: UpdateAttributeStatusParams,
): Promise<IResponse<AttributeShowData & CommonField>> {
  return request.post({
    url: 'system/attribute/update/status',
    data: params,
    token: true,
  })
}
