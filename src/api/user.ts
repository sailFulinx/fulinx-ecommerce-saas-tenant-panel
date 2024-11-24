import request from '@/utils/axios'
/**
 * 获取用户列表 - 分页
 * @param id
 * @returns
 */
export function fetchUserPaginationApi(
  data: Pagination & UserRequestQueryParameterType,
): Promise<IResponse<TableResponse<UserDataType & CommonField>>> {
  return request.post({
    url: 'system/user/pagination',
    token: true,
    data,
  })
}

/**
 * 查看用户
 * @param id
 * @returns
 */
export function fetchUserDetailApi(id: string | string): Promise<IResponse<UserDataType & CommonField>> {
  return request.get({
    url: `system/user/${id}`,
    token: true,
  })
}

/**
 * 修改
 * @param id
 * @param data
 * @returns
 */
export function approvalAvatarApi(data: any): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: 'system/user/avatar/approval',
    token: true,
    data,
  })
}

/**
 * 修改
 * @param id
 * @param data
 * @returns
 */
export function editUserApi(id: string | string, data: UserRequestParams): Promise<IResponse<UserDataType & CommonField>> {
  return request.put({
    url: `system/user/${id}`,
    token: true,
    data,
  })
}

/**
 * 修改
 * @param id
 * @param data
 * @returns
 */
export function createUserApi(data: UserRequestParams): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: 'system/user',
    token: true,
    data,
  })
}

/**
 * 删除
 * @param id
 * @returns
 */
export function removeUserApi(data: DeleteUserDataType): Promise<IResponse<UserDataType & CommonField>> {
  return request.delete({
    url: 'system/user',
    token: true,
    data,
  })
}

/**
 * 修改用户密码
 * @param id
 * @param data
 * @returns
 */
export function editUserPasswordApi(data: EditUserPasswordType): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: 'system/user/update/password',
    token: true,
    data,
  })
}

export function updateUserStatus(data: UserStatusUpdateRequest): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: '/system/user/update/status',
    token: true,
    data,
  })
}

export function fetchUserInfoApi(): Promise<IResponse<UserDetailResponseType>> {
  return request.get({
    url: 'system/user',
    token: true,
  })
}

export function resetPasswordApi(data: ResetUserPasswordType): Promise<IResponse<UserDataType & CommonField>> {
  return request.post({
    url: 'system/user/reset/password',
    token: true,
    data,
  })
}
