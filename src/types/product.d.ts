interface ProductFileRequestDo {
  /* Product ID */
  productId?: string

  /* Product File TYpe */
  productFileType: number

  /* File ID */
  fileId?: string

  /* Is Default, 0 - No, 1 - Yes */
  isDefault?: boolean

  /* Sort */
  sort?: number
}

interface ProductPriceCreateRequestDo {
  /* Order Quantity */
  orderQuantity: number

  /* Price */
  price: number

  /* Is Setting Sale Price */
  isSettingSalePrice?: boolean

  /* Sale Price */
  salePrice?: number

  /* Sale Price Started At */
  salePriceStartedAt?: string

  /* Is Setting Sale Ended TIme, , 0 - No, 1 - Yes */
  isSettingSaleEndedTime?: boolean

  /* Sale Price Ended At */
  salePriceEndedAt?: string
}

interface ProductParameterRelationRequestDo {
  /* Parameter Group ID */
  parameterGroupId: string

  /* Parameter ID */
  parameterId: string

  /* Parameter Value ID */
  parameterValueId?: string

  /* Parameter Value Content */
  parameterValueContent?: string
}

interface CreateProductParams {
  /* Language ID */
  languageId: string

  /* SKU */
  sku: string

  /* MPN */
  mpn: string

  /* Is Setting Online Time */
  isSettingOnlineTime: boolean

  /* Online Time */
  onlineTime?: string

  /* Is Setting Offline Time */
  isSettingOfflineTime?: boolean

  /* Offline Time */
  offlineTime?: string

  /* In Stock Quantity */
  inStockQuantity?: number

  /* Processing Quantity */
  processingQuantity?: number

  /* Processing Days */
  processingDays?: number

  /* Production Cycle */
  productionCycle?: number

  /* Supplier ID */
  supplierId?: string

  /* Product Name */
  productName: string

  /* Currency ID */
  currencyId: string

  /* Parameter Group ID */
  parameterGroupId?: string

  /* Category ID Array */
  categoryIds: string[]

  /* Product Price Create Request Dos */
  productPriceCreateRequestDos: ProductPriceCreateRequestDo[]

  /* Product File Request */
  productImageRequestDos?: ProductFileRequestDo[]

  /* Product Parameter Relation Request Dos */
  productParameterRelationRequestDos: ProductParameterRelationRequestDo[]

  /* Product Description */
  productDescription?: string
}

interface CreateProductRes {
  /* Product ID */
  id: string

  /* SKU */
  sku: string

  /* MPN */
  mpn: string

  /* Product Type, 1: Simple 2: Configurable 3: Virtual */
  productType: number

  /* Is Required Shipping */
  isRequiredShipping: boolean

  /* Is Setting Online Time */
  isSettingOnlineTime: boolean

  /* Online Time */
  onlineTime: Record<string, unknown>

  /* Is Setting Offline Time */
  isSettingOfflineTime: boolean

  /* Offline Time */
  offlineTime: Record<string, unknown>

  /* In Stock Quantity */
  inStockQuantity: number

  /* Processing Quantity */
  processingQuantity: number

  /* Processing Days */
  processingDays: number

  /* Production Cycle */
  productionCycle: number

  /* Brand ID */
  brandId: string

  /* Supplier ID */
  supplierId: string

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean
}

interface RemoveProductParams {
  /* Product Ids */
  productIds: string[]
}

interface ProductListParams {
  /* Language ID */
  languageId: string

  /* Product Id */
  productId?: string | null

  /* Product Name */
  productName?: string | null

  /* 删除标识 */
  isDelete?: number
}

interface ProductPriceListResultDo {
  /* Product Price ID */
  id: string

  /* Product ID */
  productId: string

  /* Currency ID */
  currencyId: string

  /* */
  currencyVo: CurrencyData & CommonField

  /* Order Quantity */
  orderQuantity: number

  /* Price */
  price: number

  /* Is Setting Sale Price */
  isSettingSalePrice: boolean

  /* Sale Price */
  salePrice: number

  /* Sale Price Started At */
  salePriceStartedAt: string

  /* Is Setting Sale Ended TIme, , 0 - No, 1 - Yes */
  isSettingSaleEndedTime: boolean

  /* Sale Price Ended At */
  salePriceEndedAt: string
}

interface ProductListData {
  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Product Name */
  productName: string

  /* Brand Name */
  brandName: string

  /* Product Main Image Url */
  productMainImageUrl: string

  productPriceListResultDos: (ProductPriceListResultDo & CommonField)[]

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string
}

interface ShowProductParams {
  /* Product Id */
  productId: string

  /* Language ID */
  languageId: string
}

interface ProductAttributeRelationListResultDo {}

interface ProductBrandRelationListResultDo {
  /* Product ID */
  productId: string

  /* Brand ID */
  brandId: string
}

interface ProductCategoryRelationListResultDo {
  /* Product ID */
  productId: string

  /* Category ID */
  categoryId: string
}

interface ProductFileRelationListResultDo {
  /* Product ID */
  productId: string

  /* File ID */
  fileId: string

  /* Is Default, 0 - No, 1 - Yes */
  isDefault: boolean

  /* Sort */
  sort: number
}

interface ProductIdentifierListResultDo {
  /* Product ID */
  productId: string

  /* Is Identifier Exists, 0 - No, 1 - Yes */
  isIdentifierExists: boolean

  /* GTIN */
  gtin: string

  /* UPC */
  upc: string

  /* EAN */
  ean: string

  /* JAN */
  jan: string

  /* ISBN */
  isbn: string

  /* MPN */
  mpn: string
}

interface ProductMeasureListResultDo {
  /* Product ID */
  productId: string

  /* Weight Type, 1-g, 2-kg, 3-lb */
  weightType: number

  /* Weight */
  weight: number

  /* Length Type, 1-m, 2-cm, 3-mm, 4-inch */
  lengthType: number

  /* Length */
  length: number

  /* Width */
  width: number

  /* Height */
  height: number
}

interface ProductOtherListResultDo {
  /* Product ID */
  productId: string

  /* Product Source Type, 1-own, 2-oem, 3-agency, 4-drop, 5-other */
  productSourceType: number

  /* Is Adult,  0 - No, 1 - Yes */
  isAdult: boolean

  /* Age Group Type, 1-newborn,2-infant,3-toddler,4-kids,5-adult */
  ageGroupType: number

  /* Gender Type, 1-male,2-female,3-unisex */
  genderType: number

  /* Condition Type, 1-new,2-refurbished,3-used */
  conditionType: number
}

interface ProductParameterRelationListResultDo {}

interface ProductPriceListResultDo {
  /* Product ID */
  productId: string

  /* Price */
  price: number

  /* Is Setting Sale Price */
  isSettingSalePrice: boolean

  /* Sale Price */
  salePrice: number

  /* Sale Price Started At */
  salePriceStartedAt: string

  /* Is Setting Sale Ended TIme, , 0 - No, 1 - Yes */
  isSettingSaleEndedTime: boolean

  /* Sale Price Ended At */
  salePriceEndedAt: string
}

interface productSeoListResultDo {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string
}

interface ProductSupplierRelationListResultDo {
  /* Product ID */
  productId: string

  /* Supplier ID */
  supplierId: string
}

interface ShowProduct {
  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Product Attribute Relation List Result Dos */
  productAttributeRelationListResultDos: (ProductAttributeRelationListResultDo & CommonField)[]

  /* */
  productBrandRelationListResultDo: ProductBrandRelationListResultDo & CommonField

  /* Product Category Relation List Result Dos */
  productCategoryRelationListResultDos: (ProductCategoryRelationListResultDo & CommonField)[]

  /* Product File Relation List Result Dos */
  productFileRelationListResultDos: (ProductFileRelationListResultDo & CommonField)[]

  /* */
  productIdentifierListResultDo: ProductIdentifierListResultDo & CommonField

  /* */
  productMeasureListResultDo: ProductMeasureListResultDo & CommonField

  /* */
  productOtherListResultDo: ProductOtherListResultDo & CommonField

  /* Product Parameter Relation List Result Do */
  productParameterRelationListResultDos: (ProductParameterRelationListResultDo & CommonField)[]

  /* */
  productPriceListResultDo: ProductPriceListResultDo & CommonField

  /* */
  productSeoListResultDo: productSeoListResultDo & CommonField

  /* */
  productSupplierRelationListResultDo: ProductSupplierRelationListResultDo & CommonField

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string
}
