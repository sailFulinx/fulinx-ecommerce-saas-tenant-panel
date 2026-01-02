interface CreateBrandParams {
  /* Language ID */
  languageId: string

  /* Brand Name */
  brandName: string

  /* Brand Description */
  brandDescription?: string

  /* Brand File ID */
  brandFileId?: string
}

interface CreateBrandNameParams {
  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Brand Name */
  brandName: string
}

interface UpdateBrandDetailCustomParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Customs */
  customs?: string
}

interface CreateBrandSlugParams {
  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Slug */
  slug: string
}

interface CreateBrandRes {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Top */
  isTop: boolean

  /* Sort */
  sort: number
}

interface RemoveBrandParams {
  /* Brand Ids */
  brandIds: string[]
}

interface BrandSeoListResultDo {
  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string
}

interface BrandDetailListResultDo {
  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Brand Name */
  brandName: string

  /* Brand Short Name */
  brandShortName: string

  /* Brand Description */
  brandDescription: string

  /* Brand Short Description */
  brandShortDescription: string

  /* Brand File ID */
  brandFileId: string

  /* */
  brandFileVo: FileData & CommonField

  /* Customs */
  customs: string

  customList: CustomDataType[]

  /* Layout Type, 1: default, 2: devCustomized, 3: userDefined  */
  layoutType: number

  layoutTypeLabel?: string

  /* Dev Component Name */
  devComponentName: string

  /* Layout Content */
  layoutContent: string
}

interface BrandSeoListResultDo {

  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string
}

interface BrandAdminLocalizedViewDo {
  /* Language ID */
  languageId: string

  /* Language Name */
  languageName: string

  /* Language Code */
  languageCode: string

  /* */
  brandDetailListResultDo: (BrandDetailListResultDo & CommonField) | null

  /* */
  brandSeoListResultDo: (BrandSeoListResultDo & CommonField) | null
}

interface BrandShowData {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Top */
  isTop: boolean

  /* Sort */
  sort: number

  /* Brand Admin Localized View Dos */
  brandAdminLocalizedViewDos: BrandAdminLocalizedViewDo[]

  /* Slug ID */
  slugId: string

  /* Brand Slug */
  slug: string
}

interface RemoveBrandFileParams {
  /* Brand Detail ID */
  brandDetailId: string
}

interface UpdateBrandDetailParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Brand Name */
  brandName: string

  /* Brand Description */
  brandDescription?: string

  /* Brand File ID */
  brandFileId?: string
}

interface UpdateBrandDetailDescriptionParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Brand Description */
  brandDescription: string
}

interface UpdateBrandDetailFileParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Brand File ID */
  brandFileId?: string
}

interface UpdateBrandDetailLayoutParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Language ID */
  languageId: string

  /* Layout Type */
  layoutType?: number

  /* Dev Component Name */
  devComponentName?: string

  /* Layout Content */
  layoutContent?: string
}

interface UpdateBrandDetailBrandNameParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Brand Name */
  brandName: string
}

interface UpdateBrandDetailBrandShortDescriptionParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Brand Short Description */
  brandShortDescription?: string
}

interface UpdateBrandDetailBrandShortNameParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Brand Name */
  brandShortName: string
}

interface UpdateBrandIsTopParams {
  /* Brand ID */
  brandId: string

  /* Is Top */
  isTop: boolean

  /* Language ID */
  languageId: string
}

interface BrandListParams {
  /* Language ID */
  languageId: string

  /* Brand Id */
  brandId?: string

  /* 品牌标题 */
  brandName?: string | null

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface BrandListData {
  /* Brand ID */
  id: string

  /* Language ID */
  languageId: string

  /* Brand Name */
  brandName: string

  /* Brand Description */
  brandDescription: string

  /* Brand File ID */
  brandFileId: string

  /* */
  brandFileVo: FileData & CommonField

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string
}

interface CreateBrandSeoParams {
  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Brand Meta Title */
  metaTitle: string

  /* Brand Meta Description */
  metaDescription?: string
}

interface UpdateBrandSeoParams {
  /* Brand SEO ID */
  brandSeoId: string

  /* Brand Meta Title */
  metaTitle: string

  /* Brand Meta Description */
  metaDescription?: string
}

interface UpdateBrandSeoMetaDescriptionParams {
  /* Brand SEO ID */
  brandSeoId: string

  /* Brand Meta Description */
  metaDescription: string
}

interface UpdateBrandSeoMetaTitleParams {
  /* Brand SEO ID */
  brandSeoId: string

  /* Brand Meta Title */
  metaTitle: string
}

interface ShowBrandParams {
  /* Brand Id */
  brandId: string

  /* Language ID */
  languageId: string
}

interface UpdateBrandLayoutParams {
  /* Brand ID */
  brandId: string

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string

  /* Language ID */
  languageId: string
}

interface UpdateBrandSlugParams {
  /* Slug ID */
  slugId: string

  /* Language ID */
  languageId: string

  /* Slug */
  slug: string
}

interface UpdateBrandStatusParams {
  /* Brand ID */
  brandId: string

  /* Status */
  status: boolean

  /* Language ID */
  languageId: string
}

interface UpdateBrandSortParams {
  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Sort */
  sort?: number
}
