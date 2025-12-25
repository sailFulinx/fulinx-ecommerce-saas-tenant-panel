import request from '@/utils/axios'

export function CreatePageApi(data: CreatePageParams): Promise<CreateRes> {
  return request.post({
    url: 'system/page',
    data,
    token: true,
  })
}

export function CopyPageApi(data: CopyPageParams): Promise<CreateRes> {
  return request.post({
    url: 'system/page/copy',
    data,
    token: true,
  })
}

export function createPageNameApi(params: CreatePageNameParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/create/pageName',
    data: params,
    token: true,
  })
}

/**
 * 新增文章SEO
 * @param {object} params 新增文章SEO请求参数
 * @param {number} params.pageId Page ID
 * @param {number} params.languageId Language Id
 * @param {string} params.metaTitle Page Meta Title
 * @param {string} params.metaDescription Page Meta Description
 * @returns
 */
export function createPageSeoApi(params: CreatePageSeoParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/create/seo',
    data: params,
    token: true,
  })
}

/**
 * 新增文章SLUG
 * @param {object} params 新增文章SLUG请求参数
 * @param {number} params.pageId Page ID
 * @param {number} params.languageId Language Id
 * @param {string} params.slug Slug
 * @returns
 */
export function createPageSlugApi(params: CreatePageSlugParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/create/slug',
    data: params,
    token: true,
  })
}

/**
 * 删除文章
 * @param {object} params 删除文章请求参数
 * @param {Array} params.ids Page Ids
 * @returns
 */
export function removePageApi(params: RemovePageParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/page',
    data: params,
    token: true,
  })
}

/**
 * 更新文章描述
 * @param {object} params 修改文章描述请求参数
 * @param {number} params.pageId Page ID
 * @param {string} params.pageDescription Page Description
 * @returns
 */
export function updatePageDescriptionApi(
  params: UpdatePageDescriptionParams,
): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/pageDescription',
    data: params,
    token: true,
  })
}

export function updatePageShortDescriptionApi(params: UpdatePageShortDescriptionParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/pageShortDescription',
    data: params,
    token: true,
  })
}

/**
 * 更新文章名称
 * @param {object} params 修改文章名称请求参数
 * @param {number} params.pageId Page ID
 * @param {string} params.pageName Page Name
 * @returns
 */
export function updatePageNameApi(params: UpdatePageNameParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/pageName',
    data: params,
    token: true,
  })
}

export function updatePageShortNameApi(params: UpdatePageShortNameParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/pageShortName',
    data: params,
    token: true,
  })
}

/**
 * 更新文章自定义信息
 * @param {object} params 修改文章自定义信息请求参数
 * @param {number} params.pageId Page ID
 * @param {string} params.customs Customs
 * @returns
 */
export function updatePageCustomsApi(params: UpdatePageCustomsParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/customs',
    data: params,
    token: true,
  })
}

export function updatePageLayoutApi(
  params: UpdatePageLayoutParams,
): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/layout',
    data: params,
    token: true,
  })
}

/**
 * 更新文章SEO
 * @param {object} params 修改文章SEO请求参数
 * @param {number} params.pageSeoId Page SEO ID
 * @param {string} params.metaTitle Page Meta Title
 * @param {string} params.metaDescription Page Meta Description
 * @returns
 */
export function updatePageSeoApi(params: UpdatePageSeoParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/seo',
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
export function updatePageSlugApi(params: UpdatePageSlugParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/slug',
    data: params,
    token: true,
  })
}

/**
 * 更新文章状态
 * @param {object} params 修改文章状态请求参数
 * @param {number} params.pageId Page ID
 * @param {number} params.languageId Language Id
 * @param {boolean} params.status Status
 * @returns
 */
export function updatePageStatusApi(params: UpdatePageStatusParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/update/status',
    data: params,
    token: true,
  })
}

/**
 * 查看文章
 * @param {object} params 文章详情请求参数
 * @param {number} params.pageId Page Id
 * @param {number} params.languageId Language Id
 * @returns
 */
export function showPageApi(params: ShowPageParams): Promise<IResponse<PageShowData>> {
  return request.post({
    url: 'system/page/show',
    data: params,
    token: true,
  })
}

export function pagePaginationApi(
  data: PageListParams & Pagination,
): Promise<IResponse<TableResponse<PageListData & CommonField>>> {
  return request.post({
    url: 'system/page/pagination',
    data,
    token: true,
  })
}

export function pageListApi(
  data?: PageListParams,
): Promise<IResponse<TableResponse<PageListData & CommonField>>> {
  return request.post({
    url: 'system/page/list',
    data,
    token: true,
  })
}
