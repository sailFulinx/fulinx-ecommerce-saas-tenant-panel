import request from '@/utils/axios'

/**
 * 新增属性
 * @param {object} params 新增属性请求参数
 * @param {number} params.attributeType Attribute Type, 1-Select, 2-Input, 3-Boolean
 * @param {string} params.languageId Language ID
 * @param {string} params.attributeName Attribute Name
 * @returns
 */
export function createAttributeApi(params: CreateAttributeParams): Promise<IResponse<CreateAttributeRes & CommonField>> {
  return request.post({
    url: 'system/attribute',
    data: params,
    token: true,
  })
}

export function createAttributeNameApi(params: CreateAttributeNameParams): Promise<IResponse<AttributeShowData & CommonField>> {
  return request.post({
    url: 'system/attribute/create/name',
    data: params,
    token: true,
  })
}
