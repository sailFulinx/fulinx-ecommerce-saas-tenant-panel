import request from '@/utils/axios'

/**
 * 删除属性值
 * @param {object} params 删除属性值请求参数
 * @param {Array} params.parameterValueIds Parameter Value Ids
 * @returns
 */
export function removeParameterValueApi(
  params: RemoveParameterValueParams,
): Promise<IResponse<ParameterShowData & CommonField>> {
  return request.delete({
    url: 'system/parameter/value',
    data: params,
    token: true,
  })
}

/**
 * 属性列表 - 不带分页
 * @param {object} params 分类列表请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterId Parameter Id
 * @param {string} params.parameterName 属性标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterValueListApi(
  params: ParameterValueListParams,
): Promise<IResponse<TableResponse<ParameterValueListData & CommonField>>> {
  return request.post({
    url: 'system/parameter/value/list',
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
 * @param {string} params.parameterId Parameter Id
 * @param {string} params.parameterName 属性标题
 * @param {boolean} params.status Status, 0: Disabled 1: Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterValuePaginationApi(
  params: ParameterValueListParams & Pagination,
): Promise<IResponse<TableResponse<ParameterValueListData & CommonField>>> {
  return request.post({
    url: 'system/parameter/value/pagination',
    data: params,
    token: true,
  })
}
