import request from '@/utils/axios'

/**
 * 新增属性
 * @param {object} params 新增属性请求参数
 * @param {number} params.parameterType Parameter Type, 1-Select, 2-Input, 3-Boolean
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterName Parameter Name
 * @returns
 */
export function createParameterApi(params: CreateParameterParams): Promise<IResponse<CreateParameterRes & CommonField>> {
  return request.post({
    url: 'system/parameter',
    data: params,
    token: true,
  })
}

export function createParameterNameApi(params: CreateParameterNameParams): Promise<IResponse<ParameterShowData & CommonField>> {
  return request.post({
    url: 'system/parameter/create/name',
    data: params,
    token: true,
  })
}
