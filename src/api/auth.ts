import request from '@/utils/axios'
/**
 * 登录
 * @param data
 * @returns
 */
export function tenantLoginApi(data: LoginRequestType): Promise<IResponse<AuthResponseType>> {
  return request.post({
    url: 'tenant/authentication/login',
    data,
    token: false,
    isTenantApi: true,
  })
}

export function tenantRegisterApi(data: RegisterParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'tenant/authentication/register',
    data,
    token: false,
    isTenantApi: true,
  })
}

export function tenantRegisterConfirmApi(data: RegisterConfirmParams): Promise<IResponse<AuthResponseType>> {
  return request.post({
    url: 'tenant/authentication/register/confirm',
    data,
    token: false,
    isTenantApi: true,
  })
}

export function tenantForgetPasswordApi(data: ForgetPasswordParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'tenant/authentication/forget/password',
    data,
    token: false,
    isTenantApi: true,
  })
}

export function tenantForgetPasswordConfirmApi(data: ForgetPasswordConfirmParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'tenant/authentication/forget/password/confirm',
    data,
    token: false,
    isTenantApi: true,
  })
}
