import request from '@/utils/axios'

export function fetchDashboardAnalyticsApi(): Promise<IResponse<StatisticsData>> {
  return request.get({
    url: 'system/dashboard/statistics',
    token: true,
  })
}

/**
 * 分类缺失统计-分类
 * @param {data} data 缺失分类语言分页查询参数
 * @returns
 */
export function fetchCategoryMissingStatistics(data: Pagination): Promise<IResponse<TableResponse<CategoryMissingStatisticsRes>>> {
  return request.post({
    url: 'system/dashboard/category/missing/language/statistics',
    data,
    token: true,
  })
}

/**
 * 分类缺失统计-分类
 * @param {data} data 缺失分类语言分页查询参数
 * @returns
 */
export function fetchArticleMissingStatistics(data: Pagination): Promise<IResponse<TableResponse<ArticleMissingStatisticsRes>>> {
  return request.post({
    url: 'system/dashboard/article/missing/language/statistics',
    data,
    token: true,
  })
}

/**
 * 分类Seo检查
 * @param {data} data 缺失分类语言分页查询参数
 * @returns
 */
export function fetchCategorySeoCheckList(data: Pagination): Promise<IResponse<TableResponse<CategorySeoCheckRes>>> {
  return request.post({
    url: 'system/dashboard/seo/check/category',
    data,
    token: true,
  })
}

/**
 * 文章Seo检查
 * @param {data} data 缺失分类语言分页查询参数
 * @returns
 */
export function fetchArticleSeoCheckList(data: Pagination): Promise<IResponse<TableResponse<ArticleSeoCheckRes>>> {
  return request.post({
    url: 'system/dashboard/seo/check/article',
    data,
    token: true,
  })
}
