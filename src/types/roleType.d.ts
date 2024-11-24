/**
 * 用户请求查询的参数
 */
interface UserRequestQueryParameterType {
  username?: string | null
  userType?: number
  name?: string
}

interface RolePermissionType {
  id: string
  roleId: string
  permissionId: string
}

interface RoleDataType {
  id: string
  roleType?: number | null
  roleName: string
  rolePermissions?: RolePermissionType[]
  permissionIds?: number[]
  deletedPermissionIds?: number[]
}

interface DeleteRoleDataType {
  ids: string[]
}
