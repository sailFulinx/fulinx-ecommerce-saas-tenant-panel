/**
 * 登录请求
 */
interface LoginRequestType {
  username: string
  password: string
  captchaKey: string
  captchaValue: string
}

interface RegisterParams {
  /* 邮箱 */
  email: string

  /* 密码 */
  password: string

  /* 确认密码 */
  confirmPassword: string

  /* 图形验证码键 */
  captchaKey: string

  /* 图形验证码 */
  captchaValue: string
}

interface RegisterConfirmParams {
  /* Token */
  token: string
}

interface RegisterConfirmResponse {
  /* */
  tenantId: string

  /* */
  accessToken: string

  /* */
  accessTokenExpiration: Record<string, unknown>

  /* */
  refreshToken: string

  /* */
  refreshTokenExpiration: Record<string, unknown>

  /* */
  tenantDetail: {
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
}

interface ForgetPasswordParams {
  /* email */
  email: string

  /* 图形验证码键 */
  captchaKey: string

  /* 图形验证码 */
  captchaValue: string
}

interface ForgetPasswordConfirmParams {
  /* token */
  token: string

  /* 密码 */
  password: string

  /* 确认密码 */
  confirmPassword: string
}
