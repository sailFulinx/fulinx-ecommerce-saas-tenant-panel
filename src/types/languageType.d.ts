interface LanguageListParams {
  languageCode?: string | null
}

interface LanguageData {
  languageCode: string
  id: string
  languageName: string
}

interface ListLanguageRes {
  list: LanguageData[]
  total: number
}
