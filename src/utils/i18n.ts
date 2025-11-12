import type { App } from 'vue'
import type { I18n, I18nOptions } from 'vue-i18n'

import { createI18n } from 'vue-i18n'
import { localeMap } from '@/data/language'

import { useAppStore } from '@/stores/app'

/**
 *  set html page lang
 * @param locale
 */
export const setHtmlPageLang = (locale: string) => {
  document.querySelector('html')?.setAttribute('lang', locale)
}

// eslint-disable-next-line import/no-mutable-exports
export let i18n: I18n

/**
 *  create i18n options
 * @returns
 */
export const createI18nOptions = async (): Promise<I18nOptions> => {
  const store = useAppStore()
  const locale = store.locale
  const defaultLocal = await import(`../locales/${locale}.ts`)
  const message = defaultLocal.default ?? {}

  setHtmlPageLang(locale)
  const res = {
    legacy: false,
    locale,
    fallbackLocale: locale,
    messages: {
      [locale]: message,
    },
    availableLocales: localeMap.map(v => v.lang),
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
  }
  return res
}

export const setupI18n = async (app: App<Element>) => {
  const options = await createI18nOptions()
  i18n = createI18n(options)
  app.use(i18n)
}
