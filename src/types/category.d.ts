interface CategoryDetailData {
  /* Category Detail ID */
  id: number

  /* Category ID */
  categoryId: number

  /* Language ID */
  languageId: number

  /* Language Code */
  languageCode: string

  /* Language Name */
  languageName: string

  /* Category Name */
  categoryName: string

  /* Parent Category Names */
  parentCategoryNames: string[]

  /* Category Description */
  categoryDescription: string

  /* Category File Id */
  categoryFileId: number

  /* */
  fileVo: FileData

  /* Customs */
  customs: string

  customList: CustomDataType[]

  /* Is Default */
  isDefault: boolean

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

interface RemoveCategoryParams {
  ids: number[]
}

interface CategoryListParams {
  /* ID */
  id?: number | null

  /* Language Id */
  languageId?: number | null

  /* Language Code */
  languageCode?: string | null

  /* Category Name */
  categoryName?: string | null

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface CategoryData {
  /* Category ID */
  id: number

  /* Parent ID */
  parentId: number

  /* Parent Ids */
  parentIds: number[]

  /* Category File ID */
  categoryFileId: number

  /* */
  categoryFileVo: FileData

  /* Language Id */
  languageId: number

  /* Language Code */
  languageCode: string

  /* Category Name */
  categoryName: string

  /* Category Description */
  categoryDescription: string

  /* Customs */
  customs: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  disabled: boolean

  /* Children */
  children: CategoryData[]

  /* Category Slug ID */
  slugId: number

  /* Article Slug */
  slug: string
}

interface CategorySeoData {
  /* Category SEO ID */
  id: number

  /* Category ID */
  categoryId: number

  /* Language ID */
  languageId: number

  /* Language Code */
  languageCode: string

  /* Language Name */
  languageName: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Is Default */
  isDefault: boolean

  /* Remark */
  remark: string

  /* Soft Delete Flag */
  isDelete: number

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

interface ShowCategoryParams {
  /* Category ID */
  categoryId: number

  /* Language Id */
  languageId: number | null
}

interface CategoryShowData {
  /* Category ID */
  id: number

  /* Parent ID */
  parentId: number

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout Id */
  layoutId: number | null

  /* */
  layoutListResultDo: LayoutData & CommonField

  /* Parent Ids */
  parentIds: number[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* */
  categoryDetailListResultDo: CategoryDetailData

  /* */
  seoListResultDo: CategorySeoData

  /* Category Slug ID */
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

interface ListCategoryRes {
  list: (CategoryData & CommonField)[]
  total: number
}

interface CategoryRequestParams {
  /* Parent Id */
  parentId: number

  parentIds: number[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* 新增分类详情请求参数 */
  categoryDetailVoList: CategoryDetailItem[]

  categoryDetailDoList?: CategoryDetailItem[]

  deleteLanguageIdList?: number[]
}

interface CategoryCreateRequestParams {
  /* Parent Id */
  parentId: number

  parentIds?: number[]

  languageId: number

  /* Category Name */
  categoryName: string
}

interface CategoryUpdateLayoutParams {
  /* Category Id */
  categoryId: number

  languageId: number

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout Id */
  layoutId: number
}

interface CategoryUpdateStatusParams {
  /* Category Id */
  categoryId: number

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Language Id */
  languageId: number | null
}

interface CategoryUpdateParentParams {
  /* Category Id */
  categoryId: number

  /* Parent Id */
  parentId: number

  /* Language Id */
  languageId: number | null
}

interface CategoryCreateCategoryNameParams {
  /* Category Id */
  categoryId: number

  /* languageId Id */
  languageId: number

  /* Category Name */
  categoryName: string
}

interface CategoryCreateCategorySeoParams {
  /* Category Id */
  categoryId: number

  /* languageId Id */
  languageId: number

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string
}

interface CategoryCreateCategorySlugParams {
  /* Category Id */
  categoryId: number

  /* languageId Id */
  languageId: number

  /* Slug */
  slug: string
}

interface CategoryUpdateCategoryNameParams {
  /* Category Detail Id */
  categoryDetailId: number

  /* Category Name */
  categoryName: string
}

interface CategoryUpdateCategoryDescriptionParams {
  /* Category Detail Id */
  categoryDetailId: number

  /* Category Description */
  categoryDescription: string
}

interface CategoryUpdateCategoryFileParams {
  /* Category Detail Id */
  categoryDetailId: number

  /* Category File Id */
  categoryFileId: number | null
}

interface CategoryUpdateCategoryCustomParams {
  /* Category Detail Id */
  categoryDetailId: number

  /* Customs */
  customs: string
}

interface CategoryUpdateCategorySeoParams {
  /* Category Seo ID */
  categorySeoId: number

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string
}

interface CategoryUpdateCategorySlugParams {
  /* Category Slug ID */
  slugId: number

  /* Slug */
  slug: string

  /* Language Id */
  languageId: number
}
