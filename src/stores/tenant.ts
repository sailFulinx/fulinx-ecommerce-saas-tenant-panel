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
  // 添加默认店铺ID
  const defaultStoreId = ref<string>('')

  // 登录
  const login = async ({ email, password, captchaKey, captchaValue }: LoginRequestType) => {
    const { data } = await tenantLoginApi({ email, password, captchaKey, captchaValue }).catch(error => {
      throw error
    })
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('tokenExpiration', data.accessTokenExpiration)
    tenantDetail.value = data.tenantDetail
    tenantStoreList.value = data.tenantStoreList

    // 设置第一个店铺为默认店铺
    if (data.tenantStoreList && data.tenantStoreList.length > 0) {
      defaultStoreId.value = data.tenantStoreList[0].id
    }

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

    // 设置第一个店铺为默认店铺
    if (res.data.list && res.data.list.length > 0) {
      defaultStoreId.value = res.data.list[0].id
    }

    tenantDetail.value = data
    return data
  }

  const setTenantDetail = (value: TenantDetail) => {
    tenantDetail.value = value
  }

  const setTenantStoreList = (value: (TenantStoreListData & CommonField)[]) => {
    tenantStoreList.value = value
  }

  // 设置默认店铺ID
  const setDefaultStoreId = (storeId: string) => {
    defaultStoreId.value = storeId
  }

  // 获取默认店铺
  const getDefaultStore = computed(() => {
    if (!defaultStoreId.value) {
      return null
    }
    return tenantStoreList.value.find(store => store.id === defaultStoreId.value) || null
  })

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
    defaultStoreId.value = ''
  }

  return {
    tenantDetail,
    setTenantDetail,
    tenantStoreList,
    setTenantStoreList,
    defaultStoreId,
    setDefaultStoreId,
    getDefaultStore,
    login,
    resetTenant,
    getTenantInfo,
  }
})
