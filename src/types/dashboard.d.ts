interface DashboardQueryRequestDataType {
  dateStarted?: null | string
  dateEnded?: null | string
}

interface StatisticsData {
  siteCount: number
  categoryCount: number
  articleCount: number
  messageCount: number
}

interface CategoryMissingStatisticsRes {
  /* Category ID */
  id: string

  /* Language ID */
  languageId: string

  /* Language Name */
  languageName: string
}

interface ArticleMissingStatisticsRes {
  /* Article ID */
  id: string

  /* Language ID */
  languageId: string

  /* Language Name */
  languageName: string
}

interface CategorySeoCheckRes {
  /* Category ID */
  id: string

  /* Language ID */
  languageId: string

  /* Language Name */
  languageName: string
}

interface ArticleSeoCheckRes {
  /* Article ID */
  id: string

  /* Language ID */
  languageId: string

  /* Language Name */
  languageName: string
}
