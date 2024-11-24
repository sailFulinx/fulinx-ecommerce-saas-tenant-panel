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

interface CreateBrandSlugParams {
  /* Language ID */
  languageId: string

  /* Brand ID */
  brandId: string

  /* Slug */
  slug: string
}

interface CreateBrandRes {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string
}

interface RemoveBrandParams {
  /* Brand Ids */
  brandIds: string[]
}

interface CreateBrandDetailParams {
  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string

  /* Brand Name */
  brandName: string

  /* Brand Description */
  brandDescription?: string

  /* Brand File ID */
  brandFileId?: string
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

  brandDescription: string

  /* Brand File ID */
  brandFileId: string

  /* */
  brandFileVo: { id: string } & FileData & CommonField
}

interface BrandShow {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string | null

  /* */
  brandDetailListResultDo: BrandDetailListResultDo & CommonField

  /* */
  brandSeoListResultDo: BrandSeoListResultDo & CommonField

  /* Slug ID */
  slugId: string

  /* Slug */
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
  brandFileId: string
}

interface UpdateBrandDetailBrandNameParams {
  /* Brand Detail ID */
  brandDetailId: string

  /* Brand Name */
  brandName: string
}

interface BrandListParams {
  /* Language ID */
  languageId: string

  /* Brand Id */
  brandId?: string | null

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
