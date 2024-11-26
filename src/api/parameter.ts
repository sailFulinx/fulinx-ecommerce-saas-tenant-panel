import request from '@/utils/axios'

/**
 * 新增参数
 * @param {object} params 新增参数请求参数
 * @param {number} params.parameterType Parameter Type, 1-Select, 2-Input, 3-Boolean
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterName Parameter Name
 * @returns
 */
export function createParameterApi(
  params: CreateParameterParams,
): Promise<IResponse<CreateParameterRes & CommonField>> {
  return request.post({
    url: 'system/parameter',
    data: params,
    token: true,
  })
}

/**
 * 删除参数
 * @param {object} params 删除参数请求参数
 * @param {Array} params.parameterIds Parameter Ids
 * @returns
 */
export function removeParameterApi(params: RemoveParameterParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/parameter',
    data: params,
    token: true,
  })
}

/**
 * 新增参数描述
 * @param {object} params 新增参数描述请求参数
 * @param {string} params.parameterId Parameter ID
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterName Parameter Name
 * @returns
 */
export function createParameterDetailApi(
  params: CreateParameterDetailParams,
): Promise<IResponse<ParameterShow & CommonField>> {
  return request.post({
    url: 'system/parameter/detail',
    data: params,
    token: true,
  })
}

/**
 * 更新参数描述名称
 * @param {object} params 更新参数描述参数名称请求参数
 * @param {string} params.parameterDetailId Parameter Detail ID
 * @param {string} params.parameterName Parameter Name
 * @returns
 */
export function updateParameterDetailParameterNameApi(
  params: UpdateParameterDetailParameterNameParams,
): Promise<IResponse<ParameterShow & CommonField>> {
  return request.post({
    url: 'system/parameter/detail/update/parameter/name',
    data: params,
    token: true,
  })
}

/**
 * 新增参数组
 * @param {object} params 新增参数请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterGroupName Parameter Group Name
 * @returns
 */
export function createParameterGroupApi(
  params: CreateParameterGroupParams,
): Promise<IResponse<CreateParameterGroupRes & CommonField>> {
  return request.post({
    url: 'system/parameter/group',
    data: params,
    token: true,
  })
}

/**
 * 删除参数组
 * @param {object} params 删除参数组请求参数
 * @param {Array} params.parameterGroupIds Parameter Group Ids
 * @returns
 */
export function removeParameterGroupApi(params: RemoveParameterGroupParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/parameter/group',
    data: params,
    token: true,
  })
}

/**
 * 新增参数组参数
 * @param {object} params 新增参数请求参数
 * @param {string} params.parameterGroupId Parameter Group ID
 * @param {string} params.languageId Language ID
 * @param {Array} params.parameterIds Parameter ID List
 * @returns
 */
export function createParameterGroupParameterRelationApi(
  params: CreateParameterGroupParameterRelationParams,
): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/parameter/group/add/parameter',
    data: params,
    token: true,
  })
}

export function removeParameterGroupParameterRelationApi(params: RemoveParameterGroupParameterRelationParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/parameter/group/remove/parameter',
    data: params,
    token: true,
  })
}

export function createParameterGroupDetailApi(
  params: CreateParameterGroupDetailParams,
): Promise<IResponse<ParameterGroupShow & CommonField>> {
  return request.post({
    url: 'system/parameter/group/detail',
    data: params,
    token: true,
  })
}

export function updateParameterGroupDetailParameterGroupNameApi(
  params: UpdateParameterGroupDetailParameterGroupName,
): Promise<IResponse<ParameterGroupShow & CommonField>> {
  return request.post({
    url: 'system/parameter/group/detail/update/group/name',
    data: params,
    token: true,
  })
}

/**
 * 参数组列表 - 不带分页
 * @param {object} params 分类列表请求参数
 * @param {string} params.parameterGroupId Parameter Group ID
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterGroupName Parameter Group Name
 * @param {boolean} params.status Status, 0 - Disabled , 1 - Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterGroupListApi(
  params: ParameterGroupListParams,
): Promise<IResponse<TableResponse<ParameterGroupListData & CommonField>>> {
  return request.post({
    url: 'system/parameter/group/list',
    data: params,
    token: true,
  })
}

/**
 * 参数组列表 - 带分页
 * @param {object} params 参数分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.parameterGroupId Parameter Group ID
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterGroupName Parameter Group Name
 * @param {boolean} params.status Status, 0 - Disabled , 1 - Enabled
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterGroupPaginationApi(
  params: ParameterGroupListParams,
): Promise<IResponse<TableResponse<ParameterGroupListData & CommonField>>> {
  return request.post({
    url: 'system/parameter/group/pagination',
    data: params,
    token: true,
  })
}

/**
 * 查看参数组
 * @param {object} params 参数组详情请求参数
 * @param {string} params.parameterGroupId Parameter Group Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showParameterGroupApi(
  params: ShowParameterGroupParams,
): Promise<IResponse<ParameterGroupShow & CommonField>> {
  return request.post({
    url: 'system/parameter/group/show',
    data: params,
    token: true,
  })
}

/**
 * 更新参数组状态
 * @param {object} params 更新参数组状态请求参数
 * @param {string} params.parameterGroupId Parameter Group Id
 * @param {boolean} params.status status
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateParameterGroupStatusApi(
  params: UpdateParameterGroupStatusParams,
): Promise<IResponse<ParameterGroupShow & CommonField>> {
  return request.post({
    url: 'system/parameter/group/update/status',
    data: params,
    token: true,
  })
}

/**
 * 参数列表 - 不带分页
 * @param {object} params 分类列表请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterId Parameter Id
 * @param {string} params.parameterName Parameter Name
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterListApi(
  params: ParameterListParams,
): Promise<IResponse<TableResponse<ParameterListData & CommonField>>> {
  return request.post({
    url: 'system/parameter/list',
    data: params,
    token: true,
  })
}

/**
 * 参数列表 - 带分页
 * @param {object} params 参数分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterId Parameter Id
 * @param {string} params.parameterName Parameter Name
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterPaginationApi(
  params: ParameterListParams & Pagination,
): Promise<IResponse<TableResponse<ParameterListData & CommonField>>> {
  return request.post({
    url: 'system/parameter/pagination',
    data: params,
    token: true,
  })
}

/**
 * 查看参数
 * @param {object} params 参数详情请求参数
 * @param {string} params.parameterId Parameter Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showParameterApi(params: ShowParameterParams): Promise<IResponse<ParameterShow & CommonField>> {
  return request.post({
    url: 'system/parameter/show',
    data: params,
    token: true,
  })
}

/**
 * 更新参数类型
 * @param {object} params 更新参数类型请求参数
 * @param {string} params.parameterId Parameter Id
 * @param {number} params.parameterType Parameter Type, 1-Select, 2-Input, 3-Boolean
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateParameterTypeApi(
  params: UpdateParameterTypeParams,
): Promise<IResponse<ParameterShow & CommonField>> {
  return request.post({
    url: 'system/parameter/update/parameter/type',
    data: params,
    token: true,
  })
}

/**
 * 新增参数值
 * @param {object} params 新增参数值请求参数
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterValueContent Parameter Value Content
 * @returns
 */
export function createParameterValueApi(
  params: CreateParameterValueParams,
): Promise<IResponse<CreateParameterValueRes & CommonField>> {
  return request.post({
    url: 'system/parameter/value',
    data: params,
    token: true,
  })
}

/**
 * 删除参数值
 * @param {object} params 删除参数值请求参数
 * @param {Array} params.parameterValueIds Parameter Value Ids
 * @returns
 */
export function removeParameterValueApi(params: RemoveParameterValueParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/parameter/value',
    data: params,
    token: true,
  })
}

/**
 * 新增参数值描述
 * @param {object} params 新增参数值描述请求参数
 * @param {string} params.parameterValueId Parameter Value ID
 * @param {string} params.languageId Language ID
 * @param {string} params.parameterValueContent Parameter Value Content
 * @returns
 */
export function createParameterValueDetailApi(
  params: CreateParameterValueDetailParams,
): Promise<IResponse<ParameterValueShow & CommonField>> {
  return request.post({
    url: 'system/parameter/value/detail',
    data: params,
    token: true,
  })
}

/**
 * 更新参数值描述名称
 * @param {object} params 更新参数值描述参数内容请求参数
 * @param {string} params.parameterValueDetailId Parameter Value Detail ID
 * @param {string} params.parameterValueContent Parameter Value Content
 * @param {string} params.languageId Language ID
 * @returns
 */
export function updateParameterValueDetailParameterValueContentApi(
  params: UpdateParameterValueContentParams,
): Promise<IResponse<ParameterValueShow & CommonField>> {
  return request.post({
    url: 'system/parameter/value/detail/update',
    data: params,
    token: true,
  })
}

/**
 * 参数值列表 - 不带分页
 * @param {object} params 分类列表请求参数
 * @param {string} params.parameterValueId Parameter Value ID
 * @param {string} params.languageId Language ID
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
 * 参数值列表 - 带分页
 * @param {object} params 参数分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.parameterValueId Parameter Value ID
 * @param {string} params.languageId Language ID
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

/**
 * 查看参数
 * @param {object} params 参数详情请求参数
 * @param {string} params.parameterId Parameter Id
 * @param {string} params.languageId Language ID
 * @returns
 */
export function showParameterValueApi(
  params: ShowParameterValueParams,
): Promise<IResponse<ParameterValueShow & CommonField>> {
  return request.post({
    url: 'system/parameter/value/show',
    data: params,
    token: true,
  })
}

/**
 * 参数组参数列表 - 不带分页
 * @param {object} params 参数组参数列表请求参数
 * @param {string} params.parameterGroupId Parameter Group ID
 * @param {string} params.languageId Language ID
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterGroupParameterRelationListApi(
  params: ParameterGroupParameterRelationParams,
): Promise<IResponse<TableResponse<ParameterGroupParameterRelationData & CommonField>>> {
  return request.post({
    url: 'system/parameter/group/parameter/list',
    data: params,
    token: true,
  })
}

/**
 * 参数组参数列表 - 带分页
 * @param {object} params 参数组参数分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.parameterGroupId Parameter Group ID
 * @param {string} params.languageId Language ID
 * @param {number} params.isDelete 删除标识
 * @returns
 */
export function parameterGroupParameterRelationPaginationApi(
  params: ParameterGroupParameterRelationParams & Pagination,
): Promise<IResponse<TableResponse<ParameterGroupParameterRelationData & CommonField>>> {
  return request.post({
    url: 'system/parameter/group/parameter/pagination',
    data: params,
    token: true,
  })
}
