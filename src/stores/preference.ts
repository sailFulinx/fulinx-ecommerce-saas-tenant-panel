import { useGetPreference, useInitPreference } from '@/hooks/usePreference'
import { defineStore } from 'pinia'

export const usePreferenceStore = defineStore('preference', () => {
  const preference = ref<any>({})

  const getPreferences = () => {
    return preference.value
  }
  const setPreferences = () => {
    if (!useGetPreference()) {
      useInitPreference()
    }
    preference.value = JSON.parse(useGetPreference())
    return preference.value
  }

  return {
    preference,
    getPreferences,
    setPreferences,
  }
})
