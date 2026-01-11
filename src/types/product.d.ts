interface CreateProductParams {
  /* Language ID */
  languageId: string

  /* SPU */
  spu: string

  /* Product Type: 1-physical,2-Virtual */
  productType: number

  /* Online Time */
  onlineTime?: string

  /* Offline Time */
  offlineTime?: string

  /* Brand ID */
  brandId?: string

  /* Product Source Type, 1-own, 2-oem, 3-agency, 4-drop, 5-other */
  productSourceType?: number

  /* Is Adult,  0 - No, 1 - Yes */
  isAdult?: boolean

  /* Age Group Type, 1-newborn,2-infant,3-toddler,4-kids,5-adult */
  ageGroupType?: number

  /* Gender Type, 1-male,2-female,3-unisex */
  genderType?: number

  /* Condition Type, 1-new,2-refurbished,3-used */
  conditionType?: number

  /* System Category ID */
  systemCategoryId?: string

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
  productFileRequestDos: {
    /* Product ID */
    productId?: string

    /* Language ID */
    languageId?: string

    /* Product File Type, 1-Image, 2-Video, 3-Pdf */
    productFileType: string

    /* File ID */
    fileId: string

    /* Is Default, 0 - No, 1 - Yes */
    isDefault: boolean

    /* Sort */
    sort?: string
  }[]

  /* Currency ID */
  currencyId: string

  /* Product Sku Request Do */
  productSkuRequestDo: {
    /* Product Attribute Request Do */
    productAttributeRequestDo: {
      /* Product Attribute Summary Do */
      productAttributeSummaryDo?: {
        /* Product Attribute Summary Attribute Dos */
        productAttributeSummaryAttributeDos: {
          /* Attribute ID */
          attributeId: string

          /* Attribute Names, key: 语言代码（zh-CN, en-US）, value: 对应语言的属性名称 */
          attributeNames: string

          /* Sort */
          sort: string

          /* Product Attribute Summary Attribute Value Dos */
          productAttributeSummaryAttributeValueDos: {
            /* Attribute Value ID */
            attributeValueId: string

            /* Attribute Value Contents, key: 语言代码（zh-CN, en-US）, value: 对应语言的属性值 */
            attributeValueContents: string

            /* Sort */
            sort: string

            /* Attribute Image File Id */
            attributeImageFileId?: string

            /* Attribute Image File Vo */
            attributeImageFileVo?: string
          }[]
        }[]
      }

      /* Search Index, e.g. -- 中英文混合索引，支持多语言搜索\n"color:red,blue;size:S,M,L;材质:棉,涤纶|颜色:红色,蓝色;尺码:S,M,L;material:cotton,polyester" */
      searchIndex: string
    }

    /* Product Sku Item Request Dos */
    productSkuItemRequestDos: {
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
      productSkuAttributeRequestDos: {
        /* Product Sku Attribute ID */
        id?: string

        /* Product Sku ID */
        productSkuId?: string

        /* Attribute ID */
        attributeId: string

        /* Attribute Names */
        attributeNames: string

        /* Attribute Value ID */
        attributeValueId: string

        /* Attribute Value Contents */
        attributeValueContents: string
      }[]

      /* Product Sku Inventory Request Dos */
      productSkuInventoryRequestDos: {
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
      }[]
    }[]
  }

  /* Product Parameter Relation Request Dos */
  productParameterRelationRequestDos?: {
    /* Parameter Group ID */
    parameterGroupId?: string

    /* Language ID */
    languageId: string

    /* Parameter ID */
    parameterId: string

    /* Parameter Value ID */
    parameterValueId?: string

    /* Parameter Value Content */
    parameterValueContent?: string

    /* Sort */
    sort: string
  }[]

  /* Product Related Request Dos */
  productRelatedRequestDos?: {
    /* Product ID */
    productId?: string

    /* Related Product ID */
    relatedProductId?: string

    /* Sort */
    sort?: string
  }[]

  /* Product Supplier Request Dos */
  productSupplierRequestDos?: {
    /* Product Supplier ID */
    id?: string

    /* Product ID */
    productId?: string

    /* Supplier ID */
    supplierId?: string

    /* Supplier Url */
    supplierUrl?: string
  }[]
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
