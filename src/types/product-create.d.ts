interface CreateProductNameParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Product Name */
  productName: string
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

interface CreateProductSkuParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Currency ID */
  currencyId: string

  /* Product Sku Request Do */
  productSkuRequestDo?: {
    /* Product Attribute Request Do */
    productAttributeRequestDo?: {
      /* Attribute Summary Dos */
      attributeSummaryDos: {
        /* Attribute ID */
        attributeId: string

        /* Language ID */
        languageId: string

        /* Attribute Name */
        attributeName?: string

        /* Sort */
        sort: Record<string, unknown>

        /* Attribute Value Dos */
        attributeValueDos: {
          /* Attribute Value ID */
          attributeValueId: string

          /* Language ID */
          languageId: string

          /* Attribute Value Content */
          attributeValueContent: string

          /* Sort */
          sort: Record<string, unknown>

          /* Attribute Image File Id */
          attributeImageFileId?: string

          /* File Table */
          attributeImageFileVo?: {
            /* File ID */
            id?: string

            /* Bucket Name */
            bucketName?: string

            /* Etag */
            etag?: string

            /* S3 Key */
            s3Key?: string

            /* Is Public */
            isPublic?: boolean

            /* Original File Name */
            originalFileName?: string

            /* File Name */
            fileName?: string

            /* File Content Type */
            fileContentType?: string

            /* File Extension Name */
            fileExtensionName?: string

            /* File Size */
            fileSize?: string

            /* Path */
            path?: string

            /* File Url */
            fileUrl?: string

            /* sha256 */
            sha256?: string

            /* Soft Delete Flag */
            isDelete?: Record<string, unknown>

            /* Remark */
            remark?: string

            /* Record Version */
            recordVersion?: Record<string, unknown>

            /* Record Create Name */
            recordCreateName?: string

            /* Record Update Name */
            recordUpdateName?: string

            /* Record Create Time */
            recordCreateTime?: string

            /* Record Update Time */
            recordUpdateTime?: string
          }
        }[]
      }[]

      /* Search Index, e.g. -- 混合索引\n"color:red,blue;size:S,M,L;材质:棉,涤纶|颜色:红色,蓝色;尺码:S,M,L;material:cotton,polyester" */
      searchIndex: string
    }

    /* Product Sku Item Request Dos */
    productSkuItemRequestDos: {
      /* Product Sku ID */
      id?: string

      /* Product ID */
      productId?: string

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
      weightUnit?: Record<string, unknown>

      /* Length */
      length?: number

      /* Width */
      width?: number

      /* Height */
      height?: number

      /* Length Unit */
      lengthUnit?: Record<string, unknown>

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
      productSkuAttributeRequestDos?: {
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
        quantity: Record<string, unknown>

        /* Locked Quantity */
        lockedQuantity?: Record<string, unknown>

        /* Remark */
        remark?: string
      }[]
    }[]
  }
}

interface CreateProductSupplierParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Supplier ID */
  supplierId: string

  /* Supplier URL */
  supplierUrl?: string
}

interface CreateProductTagParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Tag Name */
  tagName: string
}

interface CreateProductSlugParams {
  /* Product ID */
  productId: string

  /* Language ID */
  languageId: string

  /* Slug */
  slug: string

}
