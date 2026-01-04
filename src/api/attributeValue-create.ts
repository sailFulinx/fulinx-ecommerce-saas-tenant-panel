import request from '@/utils/axios'

/**
 * 批量新增属性值
 * @param {object} params 新增属性值请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.attributeId Attribute ID
 * @param {Array} params.attributeValueContents Attribute Value Contents
 * @returns
 */
export function createAttributeValueApi(params: CreateAttributeValueBatchParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/attribute/value',
    data: params,
    token: true,
  })
}

export function createAttributeValueContentApi(
  params: CreateAttributeValueContentParams,
): Promise<IResponse<AttributeShowData & CommonField>> {
  return request.post({
    url: 'system/attribute/create/attribute/value/content',
    data: params,
    token: true,
  })
}
