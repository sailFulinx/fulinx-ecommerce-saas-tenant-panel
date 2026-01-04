import request from '@/utils/axios'

/**
 * 删除属性值
 * @param {object} params 删除属性值请求参数
 * @param {Array} params.attributeValueIds Attribute Value Ids
 * @returns
 */
export function removeAttributeValueApi(params: RemoveAttributeValueParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/attribute/value',
    data: params,
    token: true,
  })
}

/**
 * 属性列表 - 不带分页
 * @param {object} params 分类列表请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.attributeId Attribute Id
 * @param {string} params.attributeName 属性标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function attributeValueListApi(
  params: AttributeValueListParams,
): Promise<IResponse<TableResponse<AttributeValueListData & CommonField>>> {
  return request.post({
    url: 'system/attribute/value/list',
    data: params,
    token: true,
  })
}

/**
 * 属性列表 - 带分页
 * @param {object} params 属性分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.languageId Language ID
 * @param {string} params.attributeId Attribute Id
 * @param {string} params.attributeName 属性标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function attributeValuePaginationApi(
  params: AttributeValueListParams & Pagination,
): Promise<IResponse<TableResponse<AttributeValueListData & CommonField>>> {
  return request.post({
    url: 'system/attribute/value/pagination',
    data: params,
    token: true,
  })
}
