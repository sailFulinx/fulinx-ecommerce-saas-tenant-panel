interface CategoryCreateParams {
  /* Category Type, 1: Product, 2: Article */
  categoryType: number
  parentId: string
  /* Language Id */
  languageId: string
  /* Category  Name */
  categoryName: string
  parentIds?: string[]
}

interface CategoryCreateRes {
  id: string

  /* Category Type, 1: Product, 2: Article */
  categoryType: number

  /* Parent ID */
  parentId: string

  /* Parent Ids */
  parentIds: string[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Category  Detail List Result Dos */
  categoryDetailListResultDo: CategoryDetail

  /* Category  Seo List Result Dos */
  categorySeoListResultDo: CategorySeoData

  /* Slug ID */
  slugId: string

  /* Slug */
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

interface CategoryListParams {
  /* ID */
  id?: string | null

  /* Category Type, 1: Product, 2: Article */
  categoryType?: number | null

  /* Language Id */
  languageId?: string

  /* Language Code */
  languageCode?: string

  /* Category  Name */
  categoryName?: string

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface CategoryData {
  /* Category ID */
  id: string

  disabled?: boolean

  /* Category Type, 1: Product, 2: Article */
  categoryType: number

  /* Parent ID */
  parentId: string

  /* Parent Ids */
  parentIds: Record<string, unknown>[]

  /* Language Id */
  languageId: string

  /* Language Code */
  languageCode: string

  /* Category Name */
  categoryName: string

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Is Top */
  isTop: boolean

  /* Sort */
  sort: number

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string

  children: CategoryData[]
}

interface CategoryListRes {
  list: (CategoryData & CommonField)[]
  total: number
}

interface CategoryDetail {
  /* Category  Detail ID */
  id: string

  /* Category  ID */
  categoryId: string

  /* Language ID */
  languageId: string

  /* Language Code */
  languageCode: string

  /* Language Name */
  languageName: string

  /* Category  Name */
  categoryName: string

  categoryShortName: string

  /* Parent Category  Names */
  parentCategoryNames: string[]

  /* Category  Description */
  categoryDescription: string

  categoryShortDescription: string

  /* Category  File Id */
  categoryFileId: string

  /* */
  fileVo: FileData

  /* Customs */
  customs: string

  customList: CustomDataType[]

  /* Layout Type, 1: default, 2: devCustomized, 3: userDefined  */
  layoutType: number

  /* Layout Type Label  */
  layoutTypeLabel: string

  /* Dev Component Name */
  devComponentName: string

  layoutContent: string | null

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

interface CategorySeoData {
  /* Category  SEO ID */
  id: string

  /* Category  ID */
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

interface CategoryShowListItem {
  /* Language Code */
  languageCode: string

  /* Language Name */
  languageName: string

  /* */
  categoryDetailListResultDo: CategoryDetail | null

  /* */
  categorySeoListResultDo: CategorySeoData | null
}

interface CategoryShowData {
  /* Category  ID */
  id: string

  /* Category Type, 1: Product, 2: Article */
  categoryType: number

  /* Parent ID */
  parentId: string

  /* Parent Ids */
  parentIds: string[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string

  /* Category  Show List */
  categoryAdminLocalizedViewDos: CategoryShowListItem[]

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

interface CategoryShowParams {
  /* Category  ID */
  categoryId: string

  /* Language ID */
  languageId: string
}

interface CategoryDescriptionParams {
  /* Category  Detail Id */
  categoryDetailId: string

  /* Category  Description */
  categoryDescription: string
}

interface CategoryShortDescriptionParams {
  /* Category  Detail Id */
  categoryDetailId: string

  /* Category  Description */
  categoryShortDescription: string
}

interface CategoryCustomParams {
  /* Category  Detail Id */
  categoryDetailId: string

  /* Customs */
  customs: string
}

interface CategorySortParams {
  /* Category  Id */
  categoryId: string
  /* Language ID */
  languageId: string
  /* Sort */
  sort: number
}

interface CategoryIsTopParams {
  /* Category  Id */
  categoryId: string

  /* Language ID */
  languageId: string

  /* Is Top */
  isTop: boolean
}

interface CategoryNameParams {
  /* Category  Detail Id */
  categoryDetailId: string

  /* Category  Name */
  categoryName: string
}

interface CategoryShortNameParams {
  /* Category  Detail Id */
  categoryDetailId: string

  /* Category  Name */
  categoryShortName: string
}

interface CategoryFileParams {
  /* Category  Detail Id */
  categoryDetailId: string

  /* Category  File Id */
  categoryFileId?: string
}

interface CategorySeoParams {
  /* Category  Seo ID */
  categorySeoId: string

  /* Meta Title */
  metaTitle?: string

  /* Meta Description */
  metaDescription?: string
}

interface CategorySlugParams {
  /* Slug ID */
  slugId: string

  /* Language Id */
  languageId: string

  /* Slug */
  slug: string
}

interface CategoryLayoutParams {
  /* Category  Detail Id */
  categoryDetailId: string

  /* Language ID */
  languageId: string

  /* Layout Type, 1: default, 2: devCustomized, 3: userDefined  */
  layoutType: number

  /* Dev Component Name */
  devComponentName?: string

  /* Layout ID */
  layoutContent?: string
}

interface CategoryParentParams {
  /* Category  Id */
  categoryId: string

  /* Parent Id */
  parentId: string

  /* Language ID */
  languageId: string
}

interface CategoryStatusParams {
  /* Category  Id */
  categoryId: string

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Language ID */
  languageId: string
}

interface CategoryNameCreateParams {
  /* Category  ID */
  categoryId: string

  /* Language ID */
  languageId: string

  /* Category  Name */
  categoryName: string
}

interface CategorySeoCreateParams {
  /* Category  ID */
  categoryId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string
}

interface CategorySlugCreateParams {
  /* Category  ID */
  categoryId: string

  /* Language Id */
  languageId: string

  /* Slug */
  slug: string
}

interface RemoveCategoryParams {
  /* Category  Ids */
  ids: string[]
}

interface CopyCategoryParams {
  /* Category  Id */
  categoryId: string

  /* From Language Id */
  fromLanguageId: string

  /* To Language Id */
  toLanguageId: string
}
