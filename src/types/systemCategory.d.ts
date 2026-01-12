interface SystemCategoryCreateParams {
  /* SystemCategory Type, 1: Product, 2: Article */
  systemCategoryType: number
  parentId: string
  /* Language Id */
  languageId: string
  /* SystemCategory  Name */
  systemCategoryName: string
  parentIds?: string[]
}

interface SystemCategoryCreateRes {
  id: string

  /* SystemCategory Type, 1: Product, 2: Article */
  systemCategoryType: number

  /* Parent ID */
  parentId: string

  /* Parent Ids */
  parentIds: string[]

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* SystemCategory  Detail List Result Dos */
  systemCategoryDetailListResultDo: SystemCategoryDetail

  /* SystemCategory  Seo List Result Dos */
  systemCategorySeoListResultDo: SystemCategorySeoData

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

interface SystemCategoryListParams {
  /* ID */
  id?: string | null

  /* SystemCategory Type, 1: Product, 2: Article */
  systemCategoryType?: number | null

  /* Language Id */
  languageId?: string

  /* Language Code */
  languageCode?: string

  /* SystemCategory  Name */
  systemCategoryName?: string | null

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface SystemCategoryData {
  /* SystemCategory ID */
  id: string

  disabled?: boolean

  /* SystemCategory Type, 1: Product, 2: Article */
  systemCategoryType: number

  /* Parent ID */
  parentId: string

  /* Parent Ids */
  parentIds: Record<string, unknown>[]

  /* Language Id */
  languageId: string

  /* Language Code */
  languageCode: string

  /* SystemCategory Name */
  systemCategoryName: string

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

  children: SystemCategoryData[]
}

interface SystemCategoryListRes {
  list: (SystemCategoryData & CommonField)[]
  total: number
}

interface SystemCategoryDetail {
  /* SystemCategory  Detail ID */
  id: string

  /* SystemCategory  ID */
  systemCategoryId: string

  /* Language ID */
  languageId: string

  /* Language Code */
  languageCode: string

  /* Language Name */
  languageName: string

  /* SystemCategory  Name */
  systemCategoryName: string

  systemCategoryShortName: string

  /* Parent SystemCategory  Names */
  parentSystemCategoryNames: string[]

  /* SystemCategory  Description */
  systemCategoryDescription: string

  systemCategoryShortDescription: string

  /* SystemCategory  File Id */
  systemCategoryFileId: string

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

interface SystemCategorySeoData {
  /* SystemCategory  SEO ID */
  id: string

  /* SystemCategory  ID */
  systemCategoryId: string

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

interface SystemCategoryShowListItem {
  /* Language Code */
  languageCode: string

  /* Language Name */
  languageName: string

  /* */
  systemCategoryDetailListResultDo: SystemCategoryDetail | null

  /* */
  systemCategorySeoListResultDo: SystemCategorySeoData | null
}

interface SystemCategoryShowData {
  /* SystemCategory  ID */
  id: string

  /* SystemCategory Type, 1: Product, 2: Article */
  systemCategoryType: number

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

  /* SystemCategory  Show List */
  systemCategoryAdminLocalizedViewDos: SystemCategoryShowListItem[]

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

interface SystemCategoryShowParams {
  /* SystemCategory  ID */
  systemCategoryId: string

  /* Language ID */
  languageId: string
}

interface SystemCategoryDescriptionParams {
  /* SystemCategory  Detail Id */
  systemCategoryDetailId: string

  /* SystemCategory  Description */
  systemCategoryDescription: string
}

interface SystemCategoryShortDescriptionParams {
  /* SystemCategory  Detail Id */
  systemCategoryDetailId: string

  /* SystemCategory  Description */
  systemCategoryShortDescription: string
}

interface SystemCategoryCustomParams {
  /* SystemCategory  Detail Id */
  systemCategoryDetailId: string

  /* Customs */
  customs: string
}

interface SystemCategorySortParams {
  /* SystemCategory  Id */
  systemCategoryId: string
  /* Language ID */
  languageId: string
  /* Sort */
  sort: number
}

interface SystemCategoryIsTopParams {
  /* SystemCategory  Id */
  systemCategoryId: string

  /* Language ID */
  languageId: string

  /* Is Top */
  isTop: boolean
}

interface SystemCategoryNameParams {
  /* SystemCategory  Detail Id */
  systemCategoryDetailId: string

  /* SystemCategory  Name */
  systemCategoryName: string
}

interface SystemCategoryShortNameParams {
  /* SystemCategory  Detail Id */
  systemCategoryDetailId: string

  /* SystemCategory  Name */
  systemCategoryShortName: string
}

interface SystemCategoryFileParams {
  /* SystemCategory  Detail Id */
  systemCategoryDetailId: string

  /* SystemCategory  File Id */
  systemCategoryFileId?: string
}

interface SystemCategorySeoParams {
  /* SystemCategory  Seo ID */
  systemCategorySeoId: string

  /* Meta Title */
  metaTitle?: string

  /* Meta Description */
  metaDescription?: string
}

interface SystemCategorySlugParams {
  /* Slug ID */
  slugId: string

  /* Language Id */
  languageId: string

  /* Slug */
  slug: string
}

interface SystemCategoryLayoutParams {
  /* SystemCategory  Detail Id */
  systemCategoryDetailId: string

  /* Language ID */
  languageId: string

  /* Layout Type, 1: default, 2: devCustomized, 3: userDefined  */
  layoutType: number

  /* Dev Component Name */
  devComponentName?: string

  /* Layout ID */
  layoutContent?: string
}

interface SystemCategoryParentParams {
  /* SystemCategory  Id */
  systemCategoryId: string

  /* Parent Id */
  parentId: string

  /* Language ID */
  languageId: string
}

interface SystemCategoryStatusParams {
  /* SystemCategory  Id */
  systemCategoryId: string

  /* Status, 0: Disabled 1: Enabled */
  status: boolean

  /* Language ID */
  languageId: string
}

interface SystemCategoryNameCreateParams {
  /* SystemCategory  ID */
  systemCategoryId: string

  /* Language ID */
  languageId: string

  /* SystemCategory  Name */
  systemCategoryName: string
}

interface SystemCategorySeoCreateParams {
  /* SystemCategory  ID */
  systemCategoryId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string
}

interface SystemCategorySlugCreateParams {
  /* SystemCategory  ID */
  systemCategoryId: string

  /* Language Id */
  languageId: string

  /* Slug */
  slug: string
}

interface RemoveSystemCategoryParams {
  /* SystemCategory  Ids */
  ids: string[]
}

interface CopySystemCategoryParams {
  /* SystemCategory  Id */
  systemCategoryId: string

  /* From Language Id */
  fromLanguageId: string

  /* To Language Id */
  toLanguageId: string
}
