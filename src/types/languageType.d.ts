interface LanguageListParams {
  languageCode?: string | null
}

interface LanguageData {
  languageCode: string
  id: number
  languageName: string
}

interface ListLanguageRes {
  list: LanguageData[]
  total: number
}
