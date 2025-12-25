// Page SEO List Result Do
interface PageSeoListResultDo {
  /* Page SEO ID */
  id: string

  /* Page ID */
  pageId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Soft Delete Flag */
  isDelete: number

  /* Remark */
  remark: string

  /* Record Version */
  recordVersion: number

  /* Record Create Name */
  recordCreateName: string

  /* Record Update Name */
  recordUpdateName: string

  /* Record Create Time */
  recordCreateTime: string

  /* Record Update Time */
  recordUpdateTime: string
}

// Page Detail List Result Do
interface PageDetailListResultDo {
  /* Page Detail ID */
  id: string

  /* Page ID */
  pageId: string

  /* Language ID */
  languageId: string

  /* Page Name */
  pageName: string

  pageShortName: string

  /* Description */
  pageDescription: string

  /* Short Description */
  pageShortDescription: string

  /* Customs */
  customs: string

  /* Custom List */
  customList?: CustomDataType[]

  /* Layout Type, 1: default, 2: devCustomized, 3: userDefined  */
  layoutType: number

  /* Layout Type Label  */
  layoutTypeLabel: string

  /* Dev Component Name */
  devComponentName?: string

  /* Layout ID */
  layoutContent: string
}

interface CopyPageParams {
  /* Page ID */
  pageId: string

  /* From Language Id */
  fromLanguageId: string

  /* To Language Id */
  toLanguageId: string
}

interface CreatePageParams {
  /* Language Id */
  languageId: string

  /* 状态 */
  status?: boolean

  languageId: string

  /* 文章名称 */
  pageName: string

  /* 元标题 */
  metaTitle?: string

  /* 元描述 */
  metaDescription?: string

  /* 文章描述 */
  pageDescription?: string

  /* 自定义信息 */
  customs?: string
}

// 新增文章基础信息
interface CreatePageBaseParams {
  /* Language Id */
  languageId: string

  /* Page Name */
  pageName: string

  /* 文章描述 */
  pageDescription?: string
}

// 新增文章标题
interface CreatePageNameParams {
  /* Page ID */
  pageId: string

  /* Language Id */
  languageId: string

  /* Page Name */
  pageName: string
}

// 新增文章SEO
interface CreatePageSeoParams {
  /* Page ID */
  pageId: string

  /* Language Id */
  languageId: string

  /* Page Meta Title */
  metaTitle: string

  /* Page Meta Description */
  metaDescription?: string
}

// 删除文章
interface RemovePageParams {
  /* Page Ids */
  ids: string[]
}

// 更新文章描述
interface UpdatePageDescriptionParams {
  /* Page Detail ID */
  pageDetailId: string

  /* Page Description */
  pageDescription: string
}

interface UpdatePageShortDescriptionParams {
  /* Page Detail ID */
  pageDetailId: string

  /* Page Description */
  pageShortDescription: string
}

// 更新文章名称
interface UpdatePageNameParams {
  /* Page Detail ID */
  pageDetailId: string

  /* Page Name */
  pageName: string
}

interface UpdatePageShortNameParams {
  /* Page Detail ID */
  pageDetailId: string

  /* Page Name */
  pageShortName: string
}

// 更新文章类型
interface UpdatePageTypeParams {
  /* Page ID */
  pageId: string

  /* Language Id */
  languageId: string

  /* Page Type */
  pageType: number
}

// 更新文章自定义信息
interface UpdatePageCustomsParams {
  /* Page Detail ID */
  pageDetailId: string

  /* Customs */
  customs: string
}

// 更新文章是否自定义布局
interface UpdatePageLayoutParams {
  /* Page ID */
  pageDetailId: string

  /* Language Id */
  languageId: string

  /* Layout Type, 1: default, 2: devCustomized, 3: userDefined  */
  layoutType: number

  /* Dev Component Name */
  devComponentName?: string

  /* Layout ID */
  layoutContent: string
}

// 更新文章SEO
interface UpdatePageSeoParams {
  /* Page SEO ID */
  pageSeoId: string

  /* Page Meta Title */
  metaTitle: string

  /* Page Meta Description */
  metaDescription?: string
}

// 更新文章状态
interface UpdatePageStatusParams {
  /* Page ID */
  pageId: string

  /* Language Id */
  languageId: string

  /* Status */
  status: boolean
}

interface ShowPageParams {
  /* Page Id */
  pageId?: string

  /* Language Id */
  languageId: string
}

interface CreateRes {
  /* Page ID */
  id: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Soft Delete Flag */
  isDelete: number

  /* Remark */
  remark: string

  /* Record Version */
  recordVersion: number

  /* Record Create Name */
  recordCreateName: string

  /* Record Update Name */
  recordUpdateName: string

  /* Record Create Time */
  recordCreateTime: string

  /* Record Update Time */
  recordUpdateTime: string
}

// 文章列表请求参数
interface PageListParams {
  languageId: string
  pageName?: string | null
  pageId?: number | null | string
  pageType?: string | null
}

// 文章列表单元数据
interface PageListData {
  /* Page ID */
  id: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Language ID */
  languageId: string

  /* Page Name */
  pageName: string

  /* Description */
  pageDescription: string

  /* Customs */
  customs: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Slug ID */
  slugId: string

  /* Page Slug */
  slug: string

  /* Soft Delete Flag */
  isDelete: number

  /* Remark */
  remark: string

  /* Record Version */
  recordVersion: number

  /* Record Create Name */
  recordCreateName: string

  /* Record Update Name */
  recordUpdateName: string

  /* Record Create Time */
  recordCreateTime: string

  /* Record Update Time */
  recordUpdateTime: string
}

interface PageAdminLocalizedViewDo {
  languageId: string
  languageName: string
  languageCode: string

  /* */
  pageDetailListResultDo: PageDetailListResultDo & CommonField

  /* */
  pageSeoListResultDo: PageSeoListResultDo & CommonField
}

// 文章新增，更新返回数据
interface PageShowData {
  /* Page ID */
  id: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  pageAdminLocalizedViewDos: PageAdminLocalizedViewDo[]

  /* Slug ID */
  slugId: string

  /* Page Slug */
  slug: string

  /* Soft Delete Flag */
  isDelete: number

  /* Remark */
  remark: string

  /* Record Version */
  recordVersion: number

  /* Record Create Name */
  recordCreateName: string

  /* Record Update Name */
  recordUpdateName: string

  /* Record Create Time */
  recordCreateTime: string

  /* Record Update Time */
  recordUpdateTime: string
}

interface PageCurrentShowData {
  /* Page ID */
  id: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* */
  pageDetailListResultDo: PageDetailListResultDo & CommonField

  /* */
  pageSeoListResultDo: PageSeoListResultDo & CommonField

  /* Slug ID */
  slugId: string

  /* Page Slug */
  slug: string

  /* Soft Delete Flag */
  isDelete: number

  /* Remark */
  remark: string

  /* Record Version */
  recordVersion: number

  /* Record Create Name */
  recordCreateName: string

  /* Record Update Name */
  recordUpdateName: string

  /* Record Create Time */
  recordCreateTime: string

  /* Record Update Time */
  recordUpdateTime: string
}

// 新增文章Slug
interface CreatePageSlugParams {
  /* Page ID */
  pageId: string

  /* Language Id */
  languageId: string

  /* Slug */
  slug: string
}

// 更新文章Slug
interface UpdatePageSlugParams {
  /* Slug ID */
  slugId: string

  /* Language Id */
  languageId: string

  /* Slug */
  slug: string
}
