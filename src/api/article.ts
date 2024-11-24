import request from '@/utils/axios'

/**
 * 新增文章
 * @param {object} params 新增文章请求参数
 * @param {number} params.articleType Article Type
 * @param {number} params.languageId Language Id
 * @param {boolean} params.isCustomLayout Is Custom Layout
 * @param {Array} params.categoryIds 分类ID
 * @param {boolean} params.status 状态
 * @param {Array} params.articleDetailVoList 文章详情请求参数
 * @returns
 */
export function CreateArticleApi(data: CreateArticleParams): Promise<CreateRes> {
  return request.post({
    url: 'system/article',
    data,
    token: true,
  })
}

/**
 * 新增文章基础信息
 * @param {object} params 新增文章基础信息请求参数
 * @param {number} params.articleType Article Type
 * @param {number} params.languageId Language Id
 * @param {string} params.articleName Article Name
 * @param {boolean} params.isCustomLayout Is Custom Layout
 * @param {number} params.layoutId Layout Id
 * @param {string} params.articleDescription 文章描述
 * @returns
 */
export function createArticleBaseApi(params: CreateArticleBaseParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/create/base',
    data: params,
    token: true,
  })
}

export function createArticleNameApi(params: CreateArticleNameParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/create/articleName',
    data: params,
    token: true,
  })
}

/**
 * 新增文章分类
 * @param {object} params 新增文章分类请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {Array} params.categoryIds Category ID Array
 * @returns
 */
export function createArticleCategoryApi(params: CreateArticleCategoryParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/create/category',
    data: params,
    token: true,
  })
}

/**
 * 新增文章文件
 * @param {object} params 新增文章文件请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {Array} params.articleFileVoList 文章文件请求参数
 * @returns
 */
export function createArticleFileApi(params: CreateArticleFileParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/create/file',
    data: params,
    token: true,
  })
}

/**
 * 新增文章SEO
 * @param {object} params 新增文章SEO请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {string} params.metaTitle Article Meta Title
 * @param {string} params.metaDescription Article Meta Description
 * @returns
 */
export function createArticleSeoApi(params: CreateArticleSeoParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/create/seo',
    data: params,
    token: true,
  })
}

/**
 * 新增文章SLUG
 * @param {object} params 新增文章SLUG请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {string} params.slug Slug
 * @returns
 */
export function createArticleSlugApi(params: CreateArticleSlugParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/create/slug',
    data: params,
    token: true,
  })
}

/**
 * 新增文章Tag
 * @param {object} params 新增文章Tag请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {Array} params.tagNameList Tag Name List
 * @returns
 */
export function createArticleTagApi(params: CreateArticleTagParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/create/tag',
    data: params,
    token: true,
  })
}

/**
 * 删除文章
 * @param {object} params 删除文章请求参数
 * @param {Array} params.ids Article Ids
 * @returns
 */
export function removeArticleApi(params: RemoveArticleParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/article',
    data: params,
    token: true,
  })
}

/**
 * 删除文章文件
 * @param {object} params 删除文章文件请求参数
 * @param {number} params.articleFileId articleFileId
 * @returns
 */
export function removeArticleFileApi(params: RemoveArticleFileParams): Promise<IResponse<ArticleShowData>> {
  return request.delete({
    url: 'system/article/delete/file',
    data: params,
    token: true,
  })
}

/**
 * 删除文章Tag
 * @param {object} params 删除分类Tag请求参数
 * @param {number} params.articleTagId Article Tag ID
 * @returns
 */
export function removeArticleTagApi(params: RemoveArticleTagParams): Promise<IResponse<ArticleShowData>> {
  return request.delete({
    url: 'system/article/delete/tag',
    data: params,
    token: true,
  })
}

/**
 * 更新文章描述
 * @param {object} params 修改文章描述请求参数
 * @param {number} params.articleId Article ID
 * @param {string} params.articleDescription Article Description
 * @returns
 */
export function updateArticleDescriptionApi(
  params: UpdateArticleDescriptionParams,
): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/articleDescription',
    data: params,
    token: true,
  })
}

/**
 * 更新文章名称
 * @param {object} params 修改文章名称请求参数
 * @param {number} params.articleId Article ID
 * @param {string} params.articleName Article Name
 * @returns
 */
export function updateArticleNameApi(params: UpdateArticleNameParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/articleName',
    data: params,
    token: true,
  })
}

/**
 * 更新文章类型
 * @param {object} params 修改文章类型请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {number} params.articleType Article Type
 * @returns
 */
export function updateArticleTypeApi(params: UpdateArticleTypeParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/articleType',
    data: params,
    token: true,
  })
}

/**
 * 更新文章分类
 * @param {object} params 修改文章分类请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {Array} params.categoryIds Article Category ID Array
 * @param {Array} params.deletedCategoryIds Deleted Category ID Array
 * @returns
 */
export function updateArticleCategoryApi(params: UpdateArticleCategoryParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/category',
    data: params,
    token: true,
  })
}

/**
 * 更新文章自定义信息
 * @param {object} params 修改文章自定义信息请求参数
 * @param {number} params.articleId Article ID
 * @param {string} params.customs Customs
 * @returns
 */
export function updateArticleCustomsApi(params: UpdateArticleCustomsParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/customs',
    data: params,
    token: true,
  })
}

/**
 * 更新文章是否自定义布局
 * @param {object} params 修改文章是否自定义布局请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {boolean} params.isCustomLayout Is Custom Layout
 * @param {number} params.layoutId Layout ID
 * @returns
 */
export function updateArticleIsCustomLayoutApi(
  params: UpdateArticleIsCustomLayoutParams,
): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/isCustomLayout',
    data: params,
    token: true,
  })
}

/**
 * 更新文章SEO
 * @param {object} params 修改文章SEO请求参数
 * @param {number} params.articleSeoId Article SEO ID
 * @param {string} params.metaTitle Article Meta Title
 * @param {string} params.metaDescription Article Meta Description
 * @returns
 */
export function updateArticleSeoApi(params: UpdateArticleSeoParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/seo',
    data: params,
    token: true,
  })
}

/**
 * 更新文章SLUG
 * @param {object} params 修改文章SLUG请求参数
 * @param {number} params.slugId Slug ID
 * @param {number} params.languageId Language Id
 * @param {string} params.slug Slug
 * @returns
 */
export function updateArticleSlugApi(params: UpdateArticleSlugParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/slug',
    data: params,
    token: true,
  })
}

/**
 * 更新文章状态
 * @param {object} params 修改文章状态请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language Id
 * @param {boolean} params.status Status
 * @returns
 */
export function updateArticleStatusApi(params: UpdateArticleStatusParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/status',
    data: params,
    token: true,
  })
}

/**
 * 更新文章文件
 * @param {object} params 修改文章文章请求参数
 * @param {number} params.articleId Article ID
 * @param {number} params.languageId Language ID
 * @param {Array} params.articleFileVoList 文章文件请求参数
 * @param {Array} params.articleFileRelationDeletedIds Article File Delete ID Array
 * @returns
 */
export function updateArticleFileApi(params: UpdateArticleFileParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/update/file',
    data: params,
    token: true,
  })
}

/**
 * 查看文章
 * @param {object} params 文章详情请求参数
 * @param {number} params.articleId Article Id
 * @param {number} params.languageId Language Id
 * @returns
 */
export function showArticleApi(params: ShowArticleParams): Promise<IResponse<ArticleShowData>> {
  return request.post({
    url: 'system/article/show',
    data: params,
    token: true,
  })
}

export function articlePaginationApi(
  data: ArticleListParams & Pagination,
): Promise<IResponse<TableResponse<ArticleListData & CommonField>>> {
  return request.post({
    url: 'system/article/pagination',
    data,
    token: true,
  })
}

export function articleListApi(
  data?: ArticleListParams,
): Promise<IResponse<TableResponse<ArticleListData & CommonField>>> {
  return request.post({
    url: 'system/article/list',
    data,
    token: true,
  })
}

export function fetchArticleTypeListApi(
  data?: ArticleTypeListParams,
): Promise<IResponse<TableResponse<ArticleTypeData>>> {
  return request.post({
    url: 'share/public/article/type/list',
    data,
  })
}
