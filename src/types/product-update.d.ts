interface UpdateProductAgeGroupTypeParams {
  /* Product ID */
  productId: string

  /* Age Group Type */
  ageGroupType: number

  /* Language ID */
  languageId: string
}

interface UpdateProductBrandParams {
  /* Product ID */
  productId: string

  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string
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

interface UpdateProductConditionTypeParams {
  /* Product ID */
  productId: string

  /* Condition Type */
  conditionType: number

  /* Language ID */
  languageId: string
}

interface UpdateProductCustomsParams {
  /* Product Detail ID */
  productDetailId: string

  /* Customs Info */
  customs?: string
}

interface UpdateProductFileParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Product Files */
  productFileRequestDos?: {
    /* Product ID */
    productId?: string

    /* Language ID */
    languageId: string

    /* Product File Type, 1-Image, 2-Video, 3-Pdf */
    productFileType: Record<string, unknown>

    /* File ID */
    fileId: string

    /* Is Default, 0 - No, 1 - Yes */
    isDefault: boolean

    /* Sort */
    sort?: Record<string, unknown>
  }[]

  /* Product File Deleted IDs */
  productFileDeletedIds?: Record<string, unknown>[]
}

interface UpdateProductGenderTypeParams {
  /* Product ID */
  productId: string

  /* Gender Type */
  genderType: number

  /* Language ID */
  languageId: string
}

interface UpdateProductIsAdultParams {
  /* Product ID */
  productId: string

  /* Is Adult Content */
  isAdult?: boolean

  /* Language ID */
  languageId: string
}

interface UpdateProductIsTopParams {
  /* Product ID */
  productId: string

  /* Is Top */
  isTop?: boolean

  /* Language ID */
  languageId: string
}

interface UpdateProductLayoutParams {
  /* Product Detail ID */
  productDetailId: string

  /* Layout Type */
  layoutType: number

  /* Development Component Name */
  devComponentName?: string

  /* Layout Content */
  layoutContent?: string
}

interface UpdateProductParameterParams {
  /* Product ID */
  productId: string

  /* Product Parameter Relation Request Dos */
  productParameterRelationRequestDos: {
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
    sort: Record<string, unknown>
  }[]

  /* Deleted Product Parameter Relation Ids */
  deletedProductParameterRelationIds?: Record<string, unknown>[]

  /* Parameter GroupId */
  parameterGroupId?: string

  /* Language ID */
  languageId: string
}

interface UpdateProductDescriptionParams {
  /* Product Detail ID */
  productDetailId: string

  /* Product Description */
  productDescription: string
}

interface UpdateProductMetaDescriptionParams {
  /* Product Seo ID */
  productSeoId: string

  /* Meta Description */
  metaDescription: string
}

interface UpdateProductMetaTitleParams {
  /* Product Seo ID */
  productSeoId: string

  /* Meta Title */
  metaTitle: string
}

interface UpdateProductNameParams {
  /* Product Detail ID */
  productDetailId: string

  /* Product Name */
  productName: string

}

interface UpdateProductShortDescriptionParams {
  /* Product Detail ID */
  productDetailId: string

  /* Product Short Description */
  productShortDescription: string
}

interface UpdateProductShortNameParams {
  /* Product Detail ID */
  productDetailId: string

  /* Product Short Name */
  productShortName: string
}

interface UpdateProductSkuParams {
  productId: ''
  languageId: ''
  productSkuRequestDo: {
    productAttributeRequestDo: {
      attributeSummaryDos: [
        {
          attributeId: ''
          languageId: ''
          attributeName: ''
          sort: 0
          attributeValueDos: [
            {
              attributeValueId: ''
              languageId: ''
              attributeValueContent: ''
              sort: 0
              attributeImageFileId: ''
              attributeImageFileVo: {
                id: ''
                bucketName: ''
                etag: ''
                s3Key: ''
                isPublic: true
                originalFileName: ''
                fileName: ''
                fileContentType: ''
                fileExtensionName: ''
                fileSize: ''
                path: ''
                fileUrl: ''
                sha256: ''
                isDelete: 0
                remark: ''
                recordVersion: 0
                recordCreateName: ''
                recordUpdateName: ''
                recordCreateTime: ''
                recordUpdateTime: ''
              }
            },
          ]
        },
      ]
      searchIndex: ''
    }
    productSkuItemRequestDos: [
      {
        id: ''
        productId: ''
        skuImageFileId: ''
        skuCode: ''
        currencyId: ''
        price: 0
        costPrice: 0
        promotionPrice: 0
        promotionStartedTime: ''
        promotionEndedTime: ''
        isRequiredShipping: true
        weight: 0
        weightUnit: 0
        length: 0
        width: 0
        height: 0
        lengthUnit: 0
        mpn: ''
        upc: ''
        ean: ''
        jan: ''
        isbn: ''
        issn: ''
        status: true
        remark: ''
        productSkuAttributeRequestDos: [
          {
            id: ''
            productSkuId: ''
            languageId: ''
            attributeId: ''
            attributeName: ''
            attributeValueId: ''
            attributeValueContent: ''
          },
        ]
        productSkuInventoryRequestDos: [
          {
            id: ''
            productSkuId: ''
            warehouseId: ''
            quantity: 0
            lockedQuantity: 0
            remark: ''
          },
        ]
      },
    ]
  }
}

interface UpdateProductSourceTypeParams {
  /* Product ID */
  productId: string

  /* Product Source Type */
  productSourceType: number

  /* Language ID */
  languageId: string
}

interface UpdateProductSupplierParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

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

  /* Deleted Product Supplier IDs */
  deletedProductSupplierIds?: string[]
}

interface UpdateProductSystemCategoryParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* System Category IDs */
  systemCategoryIds?: string[]

  /* Deleted System Category IDs */
  deletedSystemCategoryIds?: string[]
}

interface UpdateProductRelatedParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Product Related Request Dos */
  productRelatedRequestDos?: {
    /* Product ID */
    productId?: string

    /* Related Product ID */
    relatedProductId?: string

    /* Sort */
    sort?: number
  }[]

  /* Deleted Product Related IDs */
  deletedProductRelatedIds?: string
}

interface UpdateProductSlugParams {
  /* Slug ID */
  slugId: string

  /* Slug */
  slug: string

  /* Language ID */
  languageId: string
}

interface UpdateProductSortParams {
  /* Product ID */
  productId: string

  /* Sort Order */
  sort?: number

  /* Language ID */
  languageId: string
}

interface UpdateProductSpuParams {
  /* Product ID */
  productId: string

  /* Spu */
  spu: string

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

interface UpdateProductStockStatusParams {
  /* Product ID */
  productId: string

  /* Stock Status */
  stockStatus: number

  /* Language ID */
  languageId: string
}

/* Sort Order */
