import request from '@/utils/axios'
/**
 * 登录
 * @param data
 * @returns
 */
export function loginApi(data: LoginRequestType): Promise<IResponse<AuthResponseType>> {
  return request.post({
    url: 'system/system-user/authentication/login',
    data,
    token: false,
  })
}
