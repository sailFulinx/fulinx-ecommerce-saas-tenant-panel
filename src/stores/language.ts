import { fetchLanguageListApi } from '@/api/language'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const languages = ref<LanguageData[]>([])

  const setLanguages = async () => {
    const { data } = await fetchLanguageListApi().catch(error => {
      throw error
    })
    languages.value = data.list
  }

  /**
   * 初始化语言
   */
  const initLanguageList = async () => {
    if (!languages.value || languages.value.length === 0) {
      await setLanguages()
    }
    return languages.value
  }

  // 通过languageName获取languageId
  const getLanguageIdByName = (languageName: string) => {
    return languages.value.find(item => item.languageName === languageName)?.id
  }

  // 通过languageId获取languageName
  const getLanguageNameById = (languageId: string) => {
    return languages.value.find(item => item.id === languageId)?.languageName
  }

  // 通过languageId获取languageCode
  const getLanguageCodeById = (languageId: string) => {
    return languages.value.find(item => item.id === languageId)?.languageCode
  }

  // 通过languageCode获取languageId
  const getLanguageIdByCode = (languageCode: string) => {
    return languages.value.find(item => item.languageCode === languageCode)?.id
  }

  return {
    languages,
    setLanguages,
    initLanguageList,
    getLanguageIdByName,
    getLanguageNameById,
    getLanguageCodeById,
    getLanguageIdByCode,
  }
})
