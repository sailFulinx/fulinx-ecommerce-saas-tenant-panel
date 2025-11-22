export const useTenantStore = defineStore('tenant', () => {
  // 用户详情
  const tenantDetail = ref<TenantDetail | null>({
    operatorName: '',
    tenantId: '',
    telephone: '',
    firstName: '',
    lastName: '',
    email: '',
    isEmailVerify: 0,
    tenantProfileId: '',
    gender: 0,
  })

  // 登录
  const login = async ({ email, password, captchaKey, captchaValue }: LoginRequestType) => {
    const { data } = await tenantLoginApi({ email, password, captchaKey, captchaValue }).catch(error => {
      throw error
    })
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('tokenExpiration', data.accessTokenExpiration)
    tenantDetail.value = data.tenantDetail
    return data
  }

  const getTenantInfo = async () => {
    const { data } = await fetchTenantInfoApi().catch(error => {
      throw error
    })
    tenantDetail.value = data
    return data
  }

  const setTenantDetail = (value: TenantDetail) => {
    tenantDetail.value = value
  }

  const resetTenant = () => {
    tenantDetail.value = {
      operatorName: '',
      tenantId: '',
      telephone: '',
      firstName: '',
      lastName: '',
      email: '',
      isEmailVerify: 0,
      tenantProfileId: '',
      gender: 0,
    }
  }

  return {
    tenantDetail,
    setTenantDetail,
    login,
    resetTenant,
    getTenantInfo,
  }
})
