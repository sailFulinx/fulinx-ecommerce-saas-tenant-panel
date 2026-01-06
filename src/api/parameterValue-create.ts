import request from '@/utils/axios'

/**
 * 批量新增属性值
 * @param {object} params 新增属性值请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterId Parameter ID
 * @param {Array} params.parameterValueContents Parameter Value Contents
 * @returns
 */
export function createParameterValueApi(
  params: CreateParameterValueBatchParams,
): Promise<IResponse<ParameterShowData & CommonField>> {
  return request.post({
    url: 'system/parameter/value',
    data: params,
    token: true,
  })
}

export function createParameterValueContentApi(
  params: CreateParameterValueContentParams,
): Promise<IResponse<ParameterShowData & CommonField>> {
  return request.post({
    url: 'system/parameter/value/create/parameter/value/content',
    data: params,
    token: true,
  })
}
