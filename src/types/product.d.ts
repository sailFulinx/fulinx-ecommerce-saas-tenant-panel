interface ProductTypeListParams {
  /* Product Type */
  productTypeCode?: string | null
}

interface ProductTypeData {
  /* ID */
  id: number

  /* Code */
  code: string

  /* Product Type Name */
  productTypeName: string
}

interface AgeGroupTypeListParams {
  /* Age Group Type */
  ageGroupTypeCode?: string | null
}

interface AgeGroupTypeData {
  /* ID */
  id: number

  /* Code */
  code: string

  /* Age Group Type Name */
  ageGroupTypeName: string
}

interface GenderTypeListParams {
  /* Gender Type */
  genderTypeCode?: string | null
}

interface GenderTypeData {
  /* ID */
  id: number

  /* Code */
  code: string

  /* Gender Type Name */
  genderTypeName: string
}

interface ConditionTypeListParams {
  /* Condition Type */
  conditionTypeCode?: string | null
}

interface ConditionTypeData {
  /* ID */
  id: number

  /* Code */
  code: string

  /* Condition Type Name */
  conditionTypeName: string
}

interface ProductSourceTypeListParams {
  /* Product Source */
  productSourceCode?: string | null
}

interface ProductSourceTypeData {
  /* ID */
  id: number

  /* Code */
  code: string

  /* Product Source Type Name */
  productSourceTypeName: string
}

interface WarehouseTypeListParams {
  /* Warehouse Type */
  warehouseTypeCode?: string | null
}

interface WarehouseTypeData {
  /* ID */
  id: number

  /* Code */
  code: string

  /* Warehouse Type Name */
  warehouseTypeName: string
}

interface ProductFileRequestDo {
  /* Product ID */
  productId?: string

  /* Language ID */
  languageId: string

  /* Product File Type, 1-Image, 2-Video, 3-Pdf */
  productFileType: number

  /* File ID */
  fileId: string

  /* Is Default, 0 - No, 1 - Yes */
  isDefault: boolean

  /* Sort */
  sort?: number
}

interface AttributeValueDo {
  /* Language ID */
  languageId: string

  /* Attribute Value ID */
  attributeValueId: string

  /* Attribute Value Content */
  attributeValueContent: string

  /* Sort */
  sort: number

  /* Attribute Image File Id */
  attributeImageFileId?: string

  /* Attribute Image File Vo */
  attributeImageFileVo?: FileData & CommonField
}

interface AttributeSummaryDo {
  /* Language ID */
  languageId: string

  /* Attribute ID */
  attributeId: string

  /* Attribute Name */
  attributeName: string

  /* Sort */
  sort: number

  /* Product Attribute Summary Attribute Value Dos */
  attributeValueDos: AttributeValueDo[]

  attributeValueListResultDos?: (AttributeValueListData & CommonField)[]
}

interface ProductAttributeRequestDo {
  /* Product Attribute Summary Do */
  attributeSummaryDos: AttributeSummaryDo[]

  /* Search Index, e.g. -- 中英文混合索引，支持多语言搜索\n"color:red,blue;size:S,M,L;材质:棉,涤纶|颜色:红色,蓝色;尺码:S,M,L;material:cotton,polyester" */
  searchIndex: string
}

interface ProductSkuAttributeRequestDo {
  /* Product Sku Attribute ID */
  id?: string

  /* Product Sku ID */
  productSkuId?: string

  /* Language ID */
  languageId: string

  /* Attribute ID */
  attributeId: string

  /* Attribute Name */
  attributeName: string

  /* Attribute Value ID */
  attributeValueId: string

  /* Attribute Value Content */
  attributeValueContent: string
}

interface ProductSkuInventoryRequestDo {
  /* Product Sku Inventory ID */
  id?: string

  /* Product Sku ID */
  productSkuId?: string

  /* Warehouse ID */
  warehouseId: string

  /* Quantity */
  quantity: string

  /* Locked Quantity */
  lockedQuantity?: string

  /* Remark */
  remark?: string
}

interface ProductSkuItemRequestDo {
  /* Product Sku ID */
  id?: string

  /* Product ID */
  productId: string

  /* Sku Image File ID */
  skuImageFileId?: string

  /* Sku Code */
  skuCode: string

  /* Currency Id */
  currencyId: string

  /* Price */
  price: number

  /* Cost Price */
  costPrice?: number

  /* Promotion Price */
  promotionPrice?: number

  /* Promotion Started Time */
  promotionStartedTime?: string

  /* Promotion Ended Time */
  promotionEndedTime?: string

  /* Is Required Shipping */
  isRequiredShipping?: boolean

  /* Weight */
  weight?: number

  /* Weight Unit */
  weightUnit?: string

  /* Length */
  length?: number

  /* Width */
  width?: number

  /* Height */
  height?: number

  /* Length Unit */
  lengthUnit?: string

  /* Mpn */
  mpn?: string

  /* Upc */
  upc?: string

  /* Ean */
  ean?: string

  /* Jan */
  jan?: string

  /* Isbn */
  isbn?: string

  /* Issn */
  issn?: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status?: boolean

  /* Remark */
  remark?: string

  /* Product Sku Attribute Request Dos */
  productSkuAttributeRequestDos: ProductSkuAttributeRequestDo[]

  /* Product Sku Inventory Request Dos */
  productSkuInventoryRequestDos: ProductSkuInventoryRequestDo[]
}

interface ProductParameterRelationRequestDo {
  /* Parameter Group ID */
  parameterGroupId?: string

  /* Language ID */
  languageId: string

  parameterType?: number

  /* Parameter ID */
  parameterId: string

  parameterName?: string

  /* Parameter Value ID */
  parameterValueId?: string

  /* Parameter Value Content */
  parameterValueContent?: string

  parameterValueListResultDos?: (ParameterValueListData & CommonField)[]

  /* Sort */
  sort: number
}

interface ProductRelatedRequestDo {
  /* Product ID */
  productId?: string

  /* Related Product ID */
  relatedProductId?: string

  /* Sort */
  sort?: number
}

interface ProductSupplierRequestDo {
  /* Product Supplier ID */
  id?: string

  /* Product ID */
  productId?: string

  /* Supplier ID */
  supplierId?: string

  supplierName?: string

  /* Supplier Url */
  supplierUrl?: string

  supplierData?: (SupplierListData & CommonField) | undefined
}

interface ProductSkuRequestDo {
  stockStatus: number
  /* Product Attribute Request Do */
  productAttributeRequestDo: ProductAttributeRequestDo

  /* Product Sku Item Request Dos */
  productSkuItemRequestDos: ProductSkuItemRequestDo[]
}

interface CreateProductParams {
  /* Language ID */
  languageId: string

  /* SPU */
  spu: string

  /* Product Type: 1-physical,2-Virtual */
  productType: number | undefined

  /* Online Time */
  onlineTime?: string

  /* Offline Time */
  offlineTime?: string

  /* Brand ID */
  brandId?: string

  /* Product Source Type, 1-own, 2-oem, 3-agency, 4-drop, 5-other */
  productSourceType?: number | undefined

  /* Is Adult,  0 - No, 1 - Yes */
  isAdult?: boolean

  /* Age Group Type, 1-newborn,2-infant,3-toddler,4-kids,5-adult */
  ageGroupType?: number | undefined

  /* Gender Type, 1-male,2-female,3-unisex */
  genderType?: number | undefined

  /* Condition Type, 1-new,2-refurbished,3-used */
  conditionType?: number | undefined

  /* System Category ID */
  systemCategoryId?: string | undefined

  /* Product Name */
  productName: string

  /* Product Short Name */
  productShortName?: string

  /* Product Description */
  productDescription?: string

  /* Product Short Description */
  productShortDescription?: string

  /* Meta Title */
  metaTitle: string

  /* Meta Keywords */
  metaDescription?: string

  /* Category Ids */
  categoryIds?: string[]

  /* Product Files */
  productFileRequestDos: ProductFileRequestDo[]

  /* Currency ID */
  currencyId: string

  /* Product Sku Request Do */
  productSkuRequestDo: ProductSkuRequestDo

  /* Product Parameter Relation Request Dos */
  productParameterRelationRequestDos?: ProductParameterRelationRequestDo[]

  /* Product Related Request Dos */
  productRelatedRequestDos?: ProductRelatedRequestDo[]

  /* Product Supplier Request Dos */
  productSupplierRequestDos?: ProductSupplierRequestDo[]
}

interface CreateProductRes {
  /* SPU */
  spu: string

  /* Product Type: 1-physical,2-Virtual */
  productType: number

  /* Online Time */
  onlineTime: string

  /* Offline Time */
  offlineTime: string

  /* Brand ID */
  brandId: string

  /* Sort */
  sort: number

  /* Is Top */
  isTop: boolean

  /* Status: 0-Disabled , 1-Enabled */
  status: boolean

  /* System Status: 0-Draft, 1-Pending Review, 2-Approved, 3-Active, 4-Inactive, 5-Rejected, 6-Suspended, 7-Archived */
  systemStatus: number

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

interface ProductListParams {
  /* Language ID */
  languageId: string | null

  /* Product Id */
  productId?: string | null

  /* SPU */
  spu?: string | null

  /* Product Name */
  productName?: string | null

  /* 删除标识 */
  isDelete?: number
}

interface ProductListData {
  /* SPU */
  spu: string

  /* Product Type: 1-physical,2-Virtual */
  productType: number

  /* Online Time */
  onlineTime: string

  /* Offline Time */
  offlineTime: string

  /* Brand ID */
  brandId: string

  /* Sort */
  sort: number

  /* Is Top */
  isTop: boolean

  /* Status: 0-Disabled , 1-Enabled */
  status: boolean

  /* System Status: 0-Draft, 1-Pending Review, 2-Approved, 3-Active, 4-Inactive, 5-Rejected, 6-Suspended, 7-Archived */
  systemStatus: number

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

  /* Language ID */
  languageId: string

  /* Product Name */
  productName: string

  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string
}

interface ShowProductParams {
  /* Product ID */
  id: string

  /* Language ID */
  languageId: string
}

interface ProductCategoryRelationListResultDo {
  /* Product Category Relation ID */
  id: string

  /* Product ID */
  productId: string

  /* Category ID */
  categoryId: string

  /* Category Name */
  categoryName: string

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

interface ProductSystemCategoryRelationListResultDo {
  /* Product System Category Relation ID */
  id: string

  /* Product ID */
  productId: string

  /* System Category ID */
  systemCategoryId: string

  /* System Category Name */
  systemCategoryName: string

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

interface ProductDetailListResultDo {
  /* Product Detail ID */
  id: string

  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Product Name */
  productName: string

  /* Product Short Name */
  productShortName: string

  /* Product Description */
  productDescription: string

  /* Product Short Description */
  productShortDescription: string

  /* Layout Type, 1: default, 2: devCustomized, 3: userDefined  */
  layoutType: number

  /* Layout Type Label  */
  layoutTypeLabel: string

  /* Dev Component Name */
  devComponentName: string

  /* Layout Content */
  layoutContent: string

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

interface ProductParameterRelationListResultDo {
  /* Product Parameter Relation ID */
  id: string

  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Parameter Group ID */
  parameterGroupId: string

  /* Parameter Group Name */
  parameterGroupName: string

  /* Parameter ID */
  parameterId: string

  /* Parameter Type */
  parameterType: number

  /* Parameter Name */
  parameterName: string

  /* Parameter Value ID */
  parameterValueId: string

  /* Parameter Value Content */
  parameterValueContent: string

  /* Sort */
  sort: number

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

interface FileVo {
  /* File ID */
  id: string

  /* Bucket Name */
  bucketName: string

  /* Etag */
  etag: string

  /* S3 Key */
  s3Key: string

  /* Is Public */
  isPublic: boolean

  /* Original File Name */
  originalFileName: string

  /* File Name */
  fileName: string

  /* File Content Type */
  fileContentType: string

  /* File Extension Name */
  fileExtensionName: string

  /* Path */
  path: string

  /* File Url */
  fileUrl: string

  /* sha256 */
  sha256: string

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

interface ProductFileRelationListResultDo {
  /* Product File Relation ID */
  id: string

  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Product File Type, 1-Image, 2-Video, 3-Pdf */
  productFileType: number

  /* File ID */
  fileId: string

  /* */
  fileVo: FileVo

  /* Is Default, 0 - No, 1 - Yes */
  isDefault: boolean

  /* Sort */
  sort: number

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

interface ProductSeoListResultDo {
  /* Product SEO ID */
  id: string

  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

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

interface ProductTagListResultDo {
  /* Product Tag ID */
  id: string

  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Tag Name */
  tagName: string

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

interface ProductAdminLocalizedViewDo {
  /* Language ID */
  languageId: string

  /* Language Code */
  languageCode: string

  /* Language Name */
  languageName: string

  /* Product Category List Result Dos */
  productCategoryRelationListResultDos: ProductCategoryRelationListResultDo[]

  /* Product System Category List Result Dos */
  productSystemCategoryRelationListResultDos: ProductSystemCategoryRelationListResultDo[]

  /* */
  productDetailListResultDo: ProductDetailListResultDo

  /* Product Parameter Relation List Result Dos */
  productParameterRelationListResultDos: ProductParameterRelationListResultDo[]

  /* Product File List Result Dos */
  productFileRelationListResultDos: ProductFileRelationListResultDo[]

  /* */
  productSeoListResultDo: ProductSeoListResultDo

  /* Product Tag List Result Dos */
  productTagListResultDos: ProductTagListResultDo[]
}

interface ProductAttributeListResultDo {
  /* Product Attribute ID */
  id: string

  /* Product ID */
  productId: string

  /* Attribute Summary */
  attributeSummary: string

  /* Search Index, e.g. -- 中英文混合索引，支持多语言搜索\n"color:red,blue;size:S,M,L;材质:棉,涤纶|颜色:红色,蓝色;尺码:S,M,L;material:cotton,polyester" */
  searchIndex: string

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

interface ProductSkuAttributeListResultDo {
  /* Product Sku Attribute ID */
  id: string

  /* Product Sku ID */
  productSkuId: string

  /* Language ID */
  languageId: string

  /* Attribute ID */
  attributeId: string

  /* Attribute Name */
  attributeName: string

  /* Attribute Sort */
  attributeSort: number

  /* Attribute Value ID */
  attributeValueId: string

  /* Attribute Value Content */
  attributeValueContent: string

  /* Attribute Value Sort */
  attributeValueSort: number

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

interface ProductSkuInventoryListResultDo {
  /* Product Sku Inventory ID */
  id: string

  /* Product Sku ID */
  productSkuId: string

  /* Warehouse ID */
  warehouseId: string

  /* Quantity */
  quantity: number

  /* Locked Quantity */
  lockedQuantity: number

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

interface ProductSkuListResultDo {
  /* Product Sku ID */
  id: string

  /* Product ID */
  productId: string

  /* SKU Image File ID */
  skuImageFileId: string

  /* SKU */
  skuCode: string

  /* Currency ID */
  currencyId: string

  /* Price */
  price: number

  /* Cost Price */
  costPrice: number

  /* Promotion Price */
  promotionPrice: number

  /* Sale Price Started At */
  promotionStartedTime: string

  /* Sale Price Ended At */
  promotionEndedTime: string

  /* Is Required Shipping */
  isRequiredShipping: boolean

  /* Weight */
  weight: number

  /* Weight Unit, 1: kg, 2: g, 3: pound */
  weightUnit: number

  /* Length */
  length: number

  /* Width */
  width: number

  /* Height */
  height: number

  /* Length Unit, 1: cm, 2:mm, 3: inch */
  lengthUnit: number

  /* MPN */
  mpn: string

  /* UPC */
  upc: string

  /* EAN */
  ean: string

  /* JAN */
  jan: string

  /* ISBN */
  isbn: string

  /* ISSN */
  issn: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

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

  /* Product Sku Attribute List Result Dos */
  productSkuAttributeListResultDos: ProductSkuAttributeListResultDo[]

  /* Product Sku Inventory List Result Dos */
  productSkuInventoryListResultDos: ProductSkuInventoryListResultDo[]
}

interface ProductSupplierListResultDo {
  /* Product Supplier ID */
  id: string

  /* Product ID */
  productId: string

  /* Supplier ID */
  supplierId: string

  /* Supplier Url */
  supplierUrl: string

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

interface ProductRelatedListResultDo {
  /* Product Related ID */
  id: string

  /* Product ID */
  productId: string

  /* Relation Product ID */
  relatedProductId: string

  /* Sort */
  sort: number

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

interface ShowProduct {
  /* SPU */
  spu: string

  /* Product Type: 1-physical,2-Virtual */
  productType: number

  /* Online Time */
  onlineTime: string

  /* Offline Time */
  offlineTime: string

  /* Brand ID */
  brandId: string

  /* Sort */
  sort: number

  /* Is Top */
  isTop: boolean

  /* Status: 0-Disabled , 1-Enabled */
  status: boolean

  /* System Status: 0-Draft, 1-Pending Review, 2-Approved, 3-Active, 4-Inactive, 5-Rejected, 6-Suspended, 7-Archived */
  systemStatus: number

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

  /* Category Ids */
  categoryIds: string[]

  /* System Category Ids */
  systemCategoryIds: string[]

  /* Product Admin Localized View Dos */
  productAdminLocalizedViewDos: ProductAdminLocalizedViewDo[]

  /* */
  productAttributeListResultDo: ProductAttributeListResultDo

  /* Product Sku List Result Dos */
  productSkuListResultDos: ProductSkuListResultDo[]

  /* Product Supplier List Result Dos */
  productSupplierListResultDos: ProductSupplierListResultDo[]

  /* Product Related List Result Dos */
  productRelatedListResultDos: ProductRelatedListResultDo[]

  /* Slug ID */
  slugId: string

  /* Product Slug */
  slug: string
}
