interface CreateSupplierParams {
  /* Language ID */
  languageId: string

  /* Supplier Name */
  supplierName: string

  /* Supplier Description */
  supplierDescription?: string

  /* Supplier File ID */
  supplierFileId?: string
}

interface CreateSupplierSlugParams {
  /* Supplier ID */
  supplierId: string

  /* Language ID */
  languageId: string

  /* Slug */
  slug: string
}

interface CreateSupplierRes {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string
}

interface RemoveSupplierParams {
  /* Supplier Ids */
  supplierIds: string[]
}

interface CreateSupplierDetailParams {
  /* Supplier ID */
  supplierId: string

  /* Language ID */
  languageId: string

  /* Supplier Name */
  supplierName: string

  /* Supplier Description */
  supplierDescription?: string

  /* Supplier File ID */
  supplierFileId?: string
}

interface SupplierSeoListResultDo {
  /* Supplier ID */
  supplierId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string
}

interface SupplierDetailListResultDo {

  /* Supplier ID */
  supplierId: string

  /* Language ID */
  languageId: string

  /* Supplier Name */
  supplierName: string

  /* Supplier File ID */
  supplierFileId: string

  /* */
  supplierFileVo: FileData & CommonField
}

interface SupplierShow {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string

  /* */
  supplierDetailListResultDo: SupplierDetailListResultDo & CommonField

  /* */
  supplierSeoListResultDo: SupplierSeoListResultDo & CommonField

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string
}

interface RemoveSupplierFileParams {
  /* Supplier Detail ID */
  supplierDetailId: string
}

interface UpdateSupplierDetailParams {
  /* Supplier Detail ID */
  supplierDetailId: string

  /* Supplier Name */
  supplierName: string

  /* Supplier Description */
  supplierDescription?: string

  /* Supplier File ID */
  supplierFileId?: string
}

interface UpdateSupplierDetailDescriptionParams {
  /* Supplier Detail ID */
  supplierDetailId: string

  /* Supplier Description */
  supplierDescription: string
}

interface UpdateSupplierDetailFileParams {
  /* Supplier Detail ID */
  supplierDetailId: string

  /* Supplier File ID */
  supplierFileId: string
}

interface UpdateSupplierDetailSupplierNameParams {
  /* Supplier Detail ID */
  supplierDetailId: string

  /* Supplier Name */
  supplierName: string
}

interface SupplierListParams {
  /* Language ID */
  languageId: string

  /* Supplier Id */
  supplierId?: string

  /* 品牌标题 */
  supplierName?: string | null

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface SupplierListData {
  /* Supplier ID */
  id: string

  /* Language ID */
  languageId: string

  /* Supplier Name */
  supplierName: string

  /* Supplier Description */
  supplierDescription: string

  /* Supplier File ID */
  supplierFileId: string

  /* */
  supplierFileVo: FileData & CommonField

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

interface CreateSupplierSeoParams {
  /* Supplier ID */
  supplierId: string

  /* Language ID */
  languageId: string

  /* Supplier Meta Title */
  metaTitle: string

  /* Supplier Meta Description */
  metaDescription?: string
}

interface UpdateSupplierSeoParams {
  /* Supplier SEO ID */
  supplierSeoId: string

  /* Supplier Meta Title */
  metaTitle: string

  /* Supplier Meta Description */
  metaDescription?: string
}

interface UpdateSupplierSeoMetaDescriptionParams {
  /* Supplier SEO ID */
  supplierSeoId: string

  /* Supplier Meta Description */
  metaDescription: string
}

interface UpdateSupplierSeoMetaTitleParams {
  /* Supplier SEO ID */
  supplierSeoId: string

  /* Supplier Meta Title */
  metaTitle: string
}

interface ShowSupplierParams {
  /* Supplier Id */
  supplierId: string

  /* Language ID */
  languageId: string
}

interface UpdateSupplierLayoutParams {
  /* Supplier ID */
  supplierId: string

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string

  /* Language ID */
  languageId: string
}

interface UpdateSupplierSlugParams {
  /* Slug ID */
  slugId: string

  /* Language ID */
  languageId: string

  /* Slug */
  slug: string
}

interface UpdateSupplierStatusParams {
  /* Supplier ID */
  supplierId: string

  /* Status */
  status: boolean

  /* Language ID */
  languageId: string
}
