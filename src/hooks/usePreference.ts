import { useCurrencyStore } from '@/stores/currency'
import { useLanguageStore } from '@/stores/language'
import { hasContentElements } from '@/utils'

export const useGetPreference = () => {
  return useGetStorage('preference') || ''
}

export const useInitPreference = async () => {
  const preferenceData = useGetPreference() || ''
  if (!preferenceData || !hasContentElements(JSON.parse(preferenceData))) {
    const languages = useLanguageStore().languages
    const currencies = useCurrencyStore().currencies
    const preference = reactive<PreferenceType>({
      language: {
        id: languages[0].id,
        languageCode: languages[0].languageCode,
        languageName: languages[0].languageName,
      },
      currency: {
        id: currencies[0].id,
        currencyCode: currencies[0].currencyCode,
        currencyName: currencies[0].currencyName,
        symbolLeft: currencies[0].symbolLeft,
        symbolRight: currencies[0].symbolRight,
        decimalPlace: currencies[0].decimalPlace,
        isHot: currencies[0].isHot,
        countryName: currencies[0].countryName,
        sort: currencies[0].sort,
      },
    })
    useSetStorage('preference', JSON.stringify(preference))
    return preference
  }
  return JSON.parse(preferenceData) || ''
}

export const useGetPreferenceLanguage = () => {
  const preference = useGetPreference()
  if (preference) {
    const preferenceData = JSON.parse(preference)
    return preferenceData.language
  }
}
