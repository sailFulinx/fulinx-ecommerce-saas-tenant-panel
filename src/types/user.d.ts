interface LoginType {
  username: string
  password: string
  captchaKey: string
  captchaValue: string
}

/**
 * 用户请求查询的参数
 */
interface RoleRequestQueryParameterType {
  roleName?: string | null
  roleType?: number
}

/**
 * 修改用户
 */
interface UserDataType {
  id: string
  username: string
  userType: number | null
  password?: string
  name: string
  telephone: string
  status: number
  post: string
  gender: number | null
  roleIds: string
}

interface UserRequestParams {
  id: string
  username: string
  userType: number | null
  password?: string
  name: string
  telephone: string
  status: number
  post: string
  gender: number | null
  roleIds: string[]
}

interface UserListParams {
  telephone?: string | null
}

/**
 * 修改指定用户密码
 */
interface EditUserPasswordType {
  userId: string | number
  newPassword: string
}

interface TenantDetail {
  /* */
  operatorName: string

  /* Tenant ID */
  tenantId: string

  /* Telephone */
  telephone: string

  /* firstName */
  firstName: string

  /* lastName */
  lastName: string

  /* Email */
  email: string

  /* Is Email Verify */
  isEmailVerify: number

  /* Tenant Profile ID */
  tenantProfileId: string

  /* Gender, 1 - Male, 2 - Female */
  gender: number
}

/**
 * 用户登录
 */
interface AuthResponseType {
  userId: string
  accessToken: string
  accessTokenExpiration: string
  refreshToken: string
  refreshTokenExpiration: string
  tenantDetail: TenantDetail
}

/**
 * 用户详情
 */
interface UserDetailResponseType {
  /* */
  operatorName: string

  /* */
  userId: string

  /* */
  userRoleIds: Record<string, unknown>[]

  /* */
  userType: number

  /* */
  userProfileId: string

  /* */
  username: string

  /* */
  firstName: string

  /* */
  lastName: string

  /* */
  gender: number

  /* */
  telephone: string

  /* */
  post: string

  /* */
  authorities: {
    /* */
    authority: string
  }[]
}

/**
 * 用户授权
 */
interface UserAuthorityItem {
  authority: string
}

interface DeleteUserDataType {
  ids: string[]
}

interface UserStatusUpdateRequest {
  userId: string
  status: number
}

interface ResetUserPasswordType {
  oldPassword: string
  newPassword: string
}
