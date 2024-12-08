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

  /* Product File Type, 1-Image, 2-Video, 3-Pdf */
  productFileType: number

  /* File ID */
  fileId: string

  /* */
  fileVo: FileData & CommonField

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

interface ProductParameterRelationListResultDo {
  /* Product ID */
  productId: string

  /* Parameter Group ID */
  parameterGroupId: string

  /* Parameter Group Name */
  parameterGroupName: string

  /* Parameter ID */
  parameterId: string

  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number

  /* Parameter Name */
  parameterName: string

  /* Parameter Value ID */
  parameterValueId: string

  /* Parameter Value Content */
  parameterValueContent: string
}

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

interface ProductDetailListResultDo {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Product Name */
  productName: string

  /* Short Description */
  shortDescription: string

  /* Product Description */
  productDescription: string
}

interface ProductSupplierRelationListResultDo {
  /* Product ID */
  productId: string

  /* Supplier ID */
  supplierId: string
}

interface ProductTagListResultDo {

  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Tag Name */
  tagName: string
}

interface ShowProduct {
  /* SKU */
  sku: string

  /* MPN */
  mpn: string

  /* Product Type, 1: Simple 2: Configurable 3: Virtual */
  productType: number

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Is Required Shipping */
  isRequiredShipping: boolean

  /* Is Setting Online Time */
  isSettingOnlineTime: boolean

  /* Online Time */
  onlineTime: string | null

  /* Is Setting Offline Time */
  isSettingOfflineTime: boolean

  /* Offline Time */
  offlineTime: string | null

  /* Sort */
  sort: string

  /* In Stock Quantity */
  inStockQuantity: number

  /* Processing Quantity */
  processingQuantity: number

  /* Processing Days */
  processingDays: number

  /* Production Cycle */
  productionCycle: number

  /* Supplier ID */
  supplierId: string

  /* Parameter Group ID */
  parameterGroupId: string

  supplierShowResultDo: SupplierShow & CommonField

  /* Layout ID */
  layoutId: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Product Category Relation List Result Dos */
  productCategoryRelationListResultDos: (ProductCategoryRelationListResultDo & CommonField)[]

  /* Product File Relation List Result Dos */
  productImages: (ProductFileRelationListResultDo & CommonField)[]

  productTechnologyFiles: (ProductFileRelationListResultDo & CommonField)[]

  /* */
  productMeasureListResultDo: ProductMeasureListResultDo & CommonField

  /* */
  productOtherListResultDo: ProductOtherListResultDo & CommonField

  /* Product Parameter Relation List Result Do */
  productParameterRelationListResultDos: (ProductParameterRelationListResultDo & CommonField)[]

  /* */
  productPriceListResultDos: (ProductPriceListResultDo & CommonField)[]

  /* */
  productSeoListResultDo: productSeoListResultDo & CommonField

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string

  /* */
  productDetailListResultDo: ProductDetailListResultDo & CommonField

  /* */
  productTagListResultDos: (ProductTagListResultDo & CommonField)[]
}

interface UpdateProductCategoryParams {
  /* Product ID */
  productId: string

  /* Category Ids */
  categoryIds: string[]

  /* Deleted Category Ids */
  deletedCategoryIds: string[]

  /* Language ID */
  languageId: string
}

interface UpdateProductImageParams {
  /* Product ID */
  productId: string

  /* Product File Type */
  productFileType: number

  /* File Ids */
  fileIds: string[]

  /* Deleted File Ids */
  deletedFileIds: string[]

  /* Language ID */
  languageId: string
}

interface UpdateProductInStockQuantityParams {
  /* Product ID */
  productId: string

  /* In Stock Quantity */
  inStockQuantity: number

  /* Language ID */
  languageId: string
}

interface UpdateProductIsSettingOfflineTimeParams {
  /* Product ID */
  productId: string

  /* Is Setting Offline Time */
  isSettingOfflineTime: boolean

  /* Language ID */
  languageId: string
}

interface UpdateProductIsSettingOnlineTimeParams {
  /* Product ID */
  productId: string

  /* Is Setting Online Time */
  isSettingOnlineTime: boolean

  /* Language ID */
  languageId: string
}

interface UpdateProductMpnParams {
  /* Product ID */
  productId: string

  /* MPN */
  mpn: string

  /* Language ID */
  languageId: string
}

interface UpdateProductOfflineTimeParams {
  /* Product ID */
  productId: string

  /* Offline Time */
  offlineTime: string | null

  isSettingOfflineTime: boolean

  /* Language ID */
  languageId: string
}

interface UpdateProductOnlineTimeParams {
  /* Product ID */
  productId: string

  /* Online Time */
  onlineTime: string | null

  isSettingOnlineTime: boolean

  /* Language ID */
  languageId: string
}

interface ProductParameterRequestDo {
  /* Parameter Group ID */
  parameterGroupId: string

  /* Product Parameter Relation ID */
  productParameterRelationId: string

  /* Parameter ID */
  parameterId: string

  parameterName: string

  /* Parameter Type */
  parameterType: number

  /* Parameter Value ID */
  parameterValueId?: string

  parameterValues: (ParameterValueListResultDo & CommonField)[]

  /* Parameter Value Content */
  parameterValueContent?: string
}

interface UpdateProductParameterParams {
  /* Product ID */
  productId: string

  /* Product Parameter Relation Request Dos */
  productParameterRelationRequestDos: ProductParameterRequestDo[]

  /* Deleted Product Parameter Relation Ids */
  deletedProductParameterRelationIds: string[]

  /* Parameter GroupId */
  parameterGroupId: string

  /* Language ID */
  languageId: string
}

interface UpdateProductPriceParams {
  /* Product ID */
  productId: string

  /* Currency ID */
  currencyId: string

  /* Product Price Update Request Dos */
  productPriceUpdateRequestDos: {
    /* Product Price Id */
    productPriceId: string

    /* Order Quantity */
    orderQuantity: number

    /* Price */
    price: number

    /* Is Setting Sale Price */
    isSettingSalePrice?: boolean

    /* Sale Price */
    salePrice?: number | null

    /* Sale Price Started At */
    salePriceStartedAt?: string | null

    /* Is Setting Sale Ended TIme, , 0 - No, 1 - Yes */
    isSettingSaleEndedTime?: boolean

    /* Sale Price Ended At */
    salePriceEndedAt?: string | null
  }[]

  /* Deleted Price Ids */
  deletedPriceIds: string[]

  /* Language ID */
  languageId: string
}

interface UpdateProductProcessingDaysParams {
  /* Product ID */
  productId: string

  /* Processing Days */
  processingDays: number

  /* Language ID */
  languageId: string
}

interface UpdateProductProcessingQuantityParams {
  /* Product ID */
  productId: string

  /* Processing Quantity */
  processingQuantity: number

  /* Language ID */
  languageId: string
}

interface UpdateProductProductionCycleParams {
  /* Product ID */
  productId: string

  /* ProductionCycle */
  productionCycle: number

  /* Language ID */
  languageId: string
}

interface UpdateProductSkuParams {
  /* Product ID */
  productId: string

  /* SKU */
  sku: string

  /* Language ID */
  languageId: string
}

interface UpdateProductStatusParams {
  /* Product ID */
  productId: string

  /* Status */
  status: boolean

  /* Language ID */
  languageId: string
}

interface UpdateProductSupplierParams {
  /* Product ID */
  productId: string

  /* Supplier ID */
  supplierId: string

  /* Language ID */
  languageId: string
}

interface UpdateProductNameParams {
  /* Product Detail ID */
  productDetailId: string

  /* Product Name */
  productName: string
}

interface UpdateProductDescriptionParams {
  /* Product Detail ID */
  productDetailId: string

  /* Product Description */
  productDescription: string
}

interface UpdateProductShortDescriptionParams {
  /* Product Detail ID */
  productDetailId: string

  /* Product Short Description */
  productShortDescription: string
}

interface UpdateProductMetaTitleParams {
  /* Product Seo ID */
  productSeoId: string

  /* Meta Title */
  metaTitle: string
}

interface UpdateProductMetaDescriptionParams {
  /* Product Seo ID */
  productSeoId: string

  /* Meta Description */
  metaDescription: string
}

interface CreateProductDetailParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Product Name */
  productName: string

  /* Product Short Description */
  productShortDescription?: string

  /* Product Description */
  productDescription?: string
}

interface CreateProductSeoParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string
}

interface ProductParameterRelationRequest {
  id?: string
  parameterGroupId: string
  parameterId: string
  parameterValueId?: string
  parameterValueContent?: string
}
