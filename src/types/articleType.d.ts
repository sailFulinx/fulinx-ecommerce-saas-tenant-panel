// Article File List Result Do
interface ArticleFileListResultDo {
  /* Article File Relation ID */
  id: number

  /* Article ID */
  articleId: number

  /* Language ID */
  languageId: number

  /* Article File ID */
  articleFileId: number

  /* */
  fileVo: FileData & CommonField

  /* sort */
  sort: number
}

// Article Tag List Result Do
interface ArticleTagListResultDo {
  /* Article Tag Relation ID */
  id: number

  /* Article ID */
  articleId: number

  /* Language ID */
  languageId: number

  /* Tag Name */
  tagName: string
}

// Article SEO List Result Do
interface ArticleSeoListResultDo {
  /* Article SEO ID */
  id: number

  /* Article ID */
  articleId: number

  /* Language ID */
  languageId: number

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

// Article Category List Result Do
interface ArticleCategoryListResultDo {
  /* Article Category Relation ID */
  id: number

  /* Article ID */
  articleId: number

  /* Category ID */
  categoryId: number

  /* Category Name */
  categoryName: string

  /* Category Name List */
  categoryNameList: string[]
}

// Article Detail List Result Do
interface ArticleDetailListResultDo {
  /* Article Detail ID */
  id: number

  /* Article ID */
  articleId: number

  /* Language ID */
  languageId: number

  /* Article Name */
  articleName: string

  /* Description */
  articleDescription: string

  /* Customs */
  customs: string

  /* Custom List */
  customList?: CustomDataType[]
}

// Article File Vo
interface ArticleFileVo {
  /* Article File ID */
  articleFileId: number

  /* Is Default, 0 - No, 1 - Yes */
  isDefault: boolean

  /* Sort */
  sort: number
}

interface CreateArticleParams {
  /* Article Type */
  articleType: number | null

  /* Language Id */
  languageId: number

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout Id */
  layoutId?: number | null

  /* 分类ID */
  categoryIds?: number[]

  /* 状态 */
  status?: boolean

  languageId: number

  /* 文章名称 */
  articleName: string

  /* 元标题 */
  metaTitle?: string

  /* 元描述 */
  metaDescription?: string

  /* 文章描述 */
  articleDescription?: string

  /* 自定义信息 */
  customs?: string

  /* 文章文件请求参数 */
  articleFileVoList?: ArticleFileVo[]
  /* 文件Tag数组 */
  tags?: string[]
}

// 新增文章基础信息
interface CreateArticleBaseParams {
  /* Article Type */
  articleType: number

  /* Language Id */
  languageId: number

  /* Article Name */
  articleName: string

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout Id */
  layoutId?: number

  /* 文章描述 */
  articleDescription?: string
}

// 新增文章标题
interface CreateArticleNameParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Article Name */
  articleName: string
}

// 新增文章分类
interface CreateArticleCategoryParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Category ID Array */
  categoryIds: Record<string, unknown>[]
}

// 新增文章文件
interface CreateArticleFileParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* 文章文件请求参数 */
  articleFileVoList: ArticleFileVo[]
}

// 新增文章SEO
interface CreateArticleSeoParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Article Meta Title */
  metaTitle: string

  /* Article Meta Description */
  metaDescription?: string
}

// 新增文章Tag
interface CreateArticleTagParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Tag Name */
  tagName: string
}

// 删除文章
interface RemoveArticleParams {
  /* Article Ids */
  ids: number[]
}

// 删除文章文件
interface RemoveArticleFileParams {
  /* articleFileId */
  articleFileId: number
}

// 删除文章文件
interface RemoveArticleTagParams {
  /* Article Tag Relation ID */
  articleTagRelationId: number
}

// 更新文章描述
interface UpdateArticleDescriptionParams {
  /* Article Detail ID */
  articleDetailId: number

  /* Article Description */
  articleDescription: string
}

// 更新文章名称
interface UpdateArticleNameParams {
  /* Article Detail ID */
  articleDetailId: number

  /* Article Name */
  articleName: string
}

// 更新文章类型
interface UpdateArticleTypeParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Article Type */
  articleType: number
}

// 更新文章分类
interface UpdateArticleCategoryParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Article Category ID Array */
  categoryIds: number[]

  /* Deleted Category ID Array */
  deletedCategoryIds?: number[]
}

// 更新文章自定义信息
interface UpdateArticleCustomsParams {
  /* Article Detail ID */
  articleDetailId: number

  /* Customs */
  customs: string
}

// 更新文章是否自定义布局
interface UpdateArticleIsCustomLayoutParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: number
}

// 更新文章SEO
interface UpdateArticleSeoParams {
  /* Article SEO ID */
  articleSeoId: number

  /* Article Meta Title */
  metaTitle: string

  /* Article Meta Description */
  metaDescription?: string
}

// 更新文章状态
interface UpdateArticleStatusParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Status */
  status: boolean
}

// 更新文章文件
interface UpdateArticleFileParams {
  /* Article ID */
  articleId: number

  /* Language ID */
  languageId: number

  /* 文章文件请求参数 */
  articleFileVoList?: ArticleFileVo[]

  /* Article File Delete ID Array */
  articleFileDeletedIds: number[]
}

// 更新文章标签
interface UpdateArticleTagParams {
  /* Article Tag ID */
  articleTagId: number

  /* Tag Name */
  tagName: string
}

interface ShowArticleParams {
  /* Article Id */
  articleId?: number

  /* Language Id */
  languageId: number
}

interface CreateRes {
  /* Article ID */
  id: number

  /* Article Type, 1-Blog, 2-Page, 3-Product, 4-Video,5-image */
  articleType: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: number

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
interface ArticleListParams {
  languageId: number
  articleName?: string | null
  articleId?: number | null | string
  articleType?: string | null
}

// 文章列表单元数据
interface ArticleListData {
  /* Article ID */
  id: number

  /* Article Type */
  articleType: number

  /* Article Type Label */
  articleTypeLabel: string

  /* Category Ids */
  categoryIds: number[]

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: number

  /* */
  layoutListResultDo: LayoutData & CommonField

  /* Language ID */
  languageId: number

  /* Article Name */
  articleName: string

  /* Description */
  articleDescription: string

  /* Customs */
  customs: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Article File List Result Dos */
  articleFileListResultDos: (ArticleFileListResultDo & CommonField)[]

  /* Article Tag List Result Dos */
  articleTagListResultDos: (ArticleTagListResultDo & CommonField)[]

  /* Slug ID */
  slugId: number

  /* Article Slug */
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

// 文章新增，更新返回数据
interface ArticleShowData {
  /* Article ID */
  id: number

  /* Article Type */
  articleType: number

  /* Article Type Label */
  articleTypeLabel: string

  /* Category Ids */
  categoryIds: number[]

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: number | null

  /* */
  layoutListResultDo: LayoutData & CommonField

  /* Article Category List Result Dos */
  articleCategoryListResultDos: (ArticleCategoryListResultDo & CommonField)[]

  /* Category Name List */
  categoryNameList?: string[]

  /* */
  articleDetailListResultDo: ArticleDetailListResultDo & CommonField

  /* Article File List Result Dos */
  articleFileListResultDos: (ArticleFileListResultDo & CommonField)[]

  /* */
  seoListResultDo: ArticleSeoListResultDo & CommonField

  /* Article Tag List Result Dos */
  articleTagListResultDos: (ArticleTagListResultDo & CommonField)[]

  /* Slug ID */
  slugId: number

  /* Article Slug */
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

// 文章类型
interface ArticleTypeListParams {
  articleTypeCode: string | null
}

// 文章类型数据
interface ArticleTypeData {
  code: string
  id: number
  articleTypeName: string
}

// 文章类型列表返回数据
interface ListArticleTypeRes {
  list: ArticleTypeData[]
  total: number
}

interface CustomDataType {
  id: number
  customFieldName: string
  customType: string
  customTitle: string
  customContent: any
}

// 新增文章Slug
interface CreateArticleSlugParams {
  /* Article ID */
  articleId: number

  /* Language Id */
  languageId: number

  /* Slug */
  slug: string
}

// 更新文章Slug
interface UpdateArticleSlugParams {
  /* Slug ID */
  slugId: number

  /* Language Id */
  languageId: number

  /* Slug */
  slug: string
}
