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

  const tenantStoreList = ref<(TenantStoreListData & CommonField)[]>([])

  // 登录
  const login = async ({ email, password, captchaKey, captchaValue }: LoginRequestType) => {
    const { data } = await tenantLoginApi({ email, password, captchaKey, captchaValue }).catch(error => {
      throw error
    })
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('tokenExpiration', data.accessTokenExpiration)
    tenantDetail.value = data.tenantDetail
    tenantStoreList.value = data.tenantStoreList
    return data
  }

  const getTenantInfo = async () => {
    const { data } = await fetchTenantInfoApi().catch(error => {
      throw error
    })
    const res = await tenantStoreListApi({ tenantId: data.tenantId }).catch(error => {
      throw error
    })
    tenantStoreList.value = res.data.list
    tenantDetail.value = data
    return data
  }

  const setTenantDetail = (value: TenantDetail) => {
    tenantDetail.value = value
  }

  const setTenantStoreList = (value: (TenantStoreListData & CommonField)[]) => {
    tenantStoreList.value = value
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
    tenantStoreList.value = []
  }

  return {
    tenantDetail,
    setTenantDetail,
    tenantStoreList,
    setTenantStoreList,
    login,
    resetTenant,
    getTenantInfo,
  }
})
