/**
 * 验证码
 * @param data
 * @returns
 */
export function fetchCaptchaApi(data: CaptchaRequest): Promise<IResponse<CaptchaResponse>> {
  return request.post({
    url: 'share/public/captcha/fetch',
    data,
    token: false,
  })
}
