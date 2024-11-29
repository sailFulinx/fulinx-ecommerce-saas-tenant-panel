interface CategoryDetailData {
  /* Category Detail ID */
  id: string

  /* Category ID */
  categoryId: string

  /* Language ID */
  languageId: string

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
  categoryFileId: string

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
  ids: string[]
}

interface CategoryListParams {
  /* ID */
  id?: string | null

  /* Language Id */
  languageId?: string | null

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
  id: string

  /* Parent ID */
  parentId: string

  /* Parent Ids */
  parentIds: string[]

  /* Category File ID */
  categoryFileId: string

  /* */
  categoryFileVo: FileData

  /* Language Id */
  languageId: string

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
  slugId: string

  /* Article Slug */
  slug: string
}

interface CategorySeoData {
  /* Category SEO ID */
  id: string

  /* Category ID */
  categoryId: string

  /* Language ID */
  languageId: string

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
  categoryId: string

  /* Language Id */
  languageId: string | null
}

interface CategoryShowData {
  /* Category ID */
  id: string

  /* Parent ID */
  parentId: string

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout Id */
  layoutId: string | null

  /* */
  layoutListResultDo: LayoutData & CommonField

  /* Parent Ids */
  parentIds: string[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* */
  categoryDetailListResultDo: CategoryDetailData

  /* */
  seoListResultDo: CategorySeoData

  /* Category Slug ID */
  slugId: string

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
  parentId: string

  parentIds: string[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* 新增分类详情请求参数 */
  categoryDetailVoList: CategoryDetailItem[]

  categoryDetailDoList?: CategoryDetailItem[]

  deleteLanguageIdList?: string[]
}

interface CategoryCreateRequestParams {
  categoryType: number
  /* Parent Id */
  parentId: string

  parentIds?: string[]

  languageId: string

  /* Category Name */
  categoryName: string
}

interface CategoryUpdateLayoutParams {
  /* Category Id */
  categoryId: string

  languageId: string

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout Id */
  layoutId: string
}

interface CategoryUpdateCategoryTypeParams {
  /* Category Id */
  categoryId: string

  categoryType: number
}

interface CategoryUpdateStatusParams {
  /* Category Id */
  categoryId: string

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Language Id */
  languageId: string | null
}

interface CategoryUpdateParentParams {
  /* Category Id */
  categoryId: string

  /* Parent Id */
  parentId: string

  /* Language Id */
  languageId: string | null
}

interface CategoryCreateCategoryNameParams {
  /* Category Id */
  categoryId: string

  /* languageId Id */
  languageId: string

  /* Category Name */
  categoryName: string
}

interface CategoryCreateCategorySeoParams {
  /* Category Id */
  categoryId: string

  /* languageId Id */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string
}

interface CategoryCreateCategorySlugParams {
  /* Category Id */
  categoryId: string

  /* languageId Id */
  languageId: string

  /* Slug */
  slug: string
}

interface CategoryUpdateCategoryNameParams {
  /* Category Detail Id */
  categoryDetailId: string

  /* Category Name */
  categoryName: string
}

interface CategoryUpdateCategoryDescriptionParams {
  /* Category Detail Id */
  categoryDetailId: string

  /* Category Description */
  categoryDescription: string
}

interface CategoryUpdateCategoryFileParams {
  /* Category Detail Id */
  categoryDetailId: string

  /* Category File Id */
  categoryFileId: string | null
}

interface CategoryUpdateCategoryCustomParams {
  /* Category Detail Id */
  categoryDetailId: string

  /* Customs */
  customs: string
}

interface CategoryUpdateCategorySeoParams {
  /* Category Seo ID */
  categorySeoId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string
}

interface CategoryUpdateCategorySlugParams {
  /* Category Slug ID */
  slugId: string

  /* Slug */
  slug: string

  /* Language Id */
  languageId: string
}
