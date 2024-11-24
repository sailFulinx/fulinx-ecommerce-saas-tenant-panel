import { fetchCurrencyListApi } from '@/api/currency'
import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref<(CurrencyData & CommonField)[]>([])

  const setCurrencies = async () => {
    const { data } = await fetchCurrencyListApi().catch(error => {
      throw error
    })
    currencies.value = data.list
  }

  /**
   * 初始化语言
   */
  const initCurrencyList = async () => {
    if (!currencies.value || currencies.value.length === 0) {
      await setCurrencies()
    }
    return currencies.value
  }

  // 通过currencyId获取currencyCode
  const getCurrencyCodeById = (currencyId: string) => {
    return currencies.value.find(item => item.id === currencyId)?.currencyCode
  }

  // 通过currencyCode获取currencyId
  const getCurrencyIdByCode = (currencyCode: string) => {
    return currencies.value.find(item => item.currencyCode === currencyCode)?.id
  }

  return {
    currencies,
    setCurrencies,
    initCurrencyList,
    getCurrencyCodeById,
    getCurrencyIdByCode,
  }
})
