export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref<CurrencyData[]>([])
  const currenciesListByCode: Record<string, CurrencyData> = {}

  const setCurrencies = async () => {
    const { data } = await currencyListApi().catch(error => {
      throw error
    })
    currencies.value = data.list

    currencies.value.forEach(item => {
      currenciesListByCode[item.currencyCode] = item
    })
  }

  const getCurrencies = () => {
    return $catch(async () => {
      if (!currencies.value.length) {
        await setCurrencies()
      }
      return currencies.value
    })
  }

  /**
   * 初始化货币
   */
  const initCurrencyList = async () => {
    if (!currencies.value || currencies.value.length === 0) {
      await setCurrencies()
    }
  }

  // 通过currencyName获取currencyId
  const getCurrencyIdByName = (currencyName: string) => {
    return currencies.value.find(item => item.currencyName === currencyName)?.id
  }

  // 通过currencyId获取currencyName
  const getCurrencyNameById = (currencyId: string) => {
    return currencies.value.find(item => item.id === currencyId)?.currencyName
  }

  // 通过currencyId获取currencyCode
  const getCurrencyCodeById = (currencyId: string) => {
    return currencies.value.find(item => item.id === currencyId)?.currencyCode
  }

  // 通过currencyCode获取currencyId
  const getCurrencyIdByCode = (currencyCode: string) => {
    return currencies.value.find(item => item.currencyCode === currencyCode)?.id
  }

  const getCurrenciesListByCode = () => {
    return $clone(currenciesListByCode)
  }

  return {
    currencies,
    getCurrenciesListByCode,
    setCurrencies,
    getCurrencies,
    initCurrencyList,
    getCurrencyIdByName,
    getCurrencyNameById,
    getCurrencyCodeById,
    getCurrencyIdByCode,
  }
})
