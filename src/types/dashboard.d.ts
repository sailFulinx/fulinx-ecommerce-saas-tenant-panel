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
  id: number

  /* Language ID */
  languageId: number

  /* Language Name */
  languageName: string
}

interface ArticleMissingStatisticsRes {
  /* Article ID */
  id: number

  /* Language ID */
  languageId: number

  /* Language Name */
  languageName: string
}

interface CategorySeoCheckRes {
  /* Category ID */
  id: number

  /* Language ID */
  languageId: number

  /* Language Name */
  languageName: string
}

interface ArticleSeoCheckRes {
  /* Article ID */
  id: number

  /* Language ID */
  languageId: number

  /* Language Name */
  languageName: string
}
