import { StorageSerializers } from '@vueuse/core'

interface PreferenceType {
  language: LanguageData
}

export const usePreferenceStore = defineStore('preference', () => {
  const { languages } = useInStore(useLanguageStore)
  const preference = useStorage<PreferenceType>('preference', null, undefined, { serializer: StorageSerializers.object })

  const initPreference = () => {
    const langList = languages.value
    const defaultLanguage = langList[0]

    preference.value = {
      language: defaultLanguage,
    }
  }

  const getPreferences = () => {
    if (!preference.value?.language) {
      initPreference()
    }

    return preference.value
  }

  const setPreference = (payload: PreferenceType) => {
    preference.value = payload
    return preference.value
  }

  return {
    preference,
    initPreference,
    getPreferences,
    setPreference,
  }
})
