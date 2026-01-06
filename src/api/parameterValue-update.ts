import request from '@/utils/axios'

/**
 * 更新属性名称
 * @param {object} params 更新属性描述属性名称请求参数
 * @param {string} params.parameterDetailId Parameter Detail ID
 * @param {string} params.parameterName Parameter Name
 * @returns
 */
export function updateParameterValueContentApi(
  params: UpdateParameterValueContentParams,
): Promise<IResponse<ParameterShowData & CommonField>> {
  return request.post({
    url: 'system/parameter/value/update/detail/parameter/value/content',
    data: params,
    token: true,
  })
}

/**
 * 更新属性排序
 * @param {object} params 更新属性排序请求参数
 * @param {string} params.parameterId Parameter ID
 * @param {string} params.languageId Language ID
 * @param {number} params.sort Sort
 * @returns
 */
export function updateParameterValueSortApi(
  params: UpdateParameterValueSortParams,
): Promise<IResponse<ParameterShowData & CommonField>> {
  return request.post({
    url: 'system/parameter/value/update/sort',
    data: params,
    token: true,
  })
}

/**
 * 更新属性状态
 * @param {object} params 修改属性状态请求参数
 * @param {string} params.parameterId Parameter ID
 * @param {boolean} params.status Status
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateParameterValueStatusApi(
  params: UpdateParameterValueStatusParams,
): Promise<IResponse<ParameterShowData & CommonField>> {
  return request.post({
    url: 'system/parameter/value/update/status',
    data: params,
    token: true,
  })
}
