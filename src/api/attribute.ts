import request from '@/utils/axios'

/**
 * 删除属性
 * @param {object} params 删除属性请求参数
 * @param {Array} params.attributeIds Attribute Ids
 * @returns
 */
export function removeAttributeApi(params: RemoveAttributeParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/attribute',
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
export function attributeListApi(params: AttributeListParams): Promise<IResponse<TableResponse<AttributeListData & CommonField>>> {
  return request.post({
    url: 'system/attribute/list',
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
export function attributePaginationApi(
  params: AttributeListParams & Pagination,
): Promise<IResponse<TableResponse<AttributeListData & CommonField>>> {
  return request.post({
    url: 'system/attribute/pagination',
    data: params,
    token: true,
  })
}

/**
 * 查看属性
 * @param {object} params 属性详情请求参数
 * @param {string} params.attributeId Attribute Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showAttributeApi(params: ShowAttributeParams): Promise<IResponse<AttributeShowData & CommonField>> {
  return request.post({
    url: 'system/attribute/show',
    data: params,
    token: true,
  })
}
