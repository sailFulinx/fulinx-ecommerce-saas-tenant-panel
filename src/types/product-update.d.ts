interface UpdateAgeGroupTypeParams {
  /* Product ID */
  productId: string

  /* Age Group Type */
  ageGroupType: number

  /* Language ID */
  languageId: string
}

interface UpdateBrandParams {
  /* Product ID */
  productId: string

  /* Brand ID */
  brandId: string

  /* Language ID */
  languageId: string
}

interface UpdateCategoryParams {
  /* Product ID */
  productId: string

  /* Category Ids */
  categoryIds: string[]

  /* Deleted Category Ids */
  deletedCategoryIds: string[]

  /* Language ID */
  languageId: string
}

interface UpdateConditionTypeParams {
  /* Product ID */
  productId: string

  /* Condition Type */
  conditionType: number

  /* Language ID */
  languageId: string
}

interface UpdateCustomsParams {
  /* Product Detail ID */
  productDetailId: string

  /* Customs Info */
  customs?: string
}

interface UpdateFileParams {
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

interface UpdateGenderTypeParams {
  /* Product ID */
  productId: string

  /* Gender Type */
  genderType: number

  /* Language ID */
  languageId: string
}

interface UpdateIsAdultParams {
  /* Product ID */
  productId: string

  /* Is Adult Content */
  isAdult?: boolean

  /* Language ID */
  languageId: string
}

interface UpdateIsTopParams {
  /* Product ID */
  productId: string

  /* Is Top */
  isTop?: boolean

  /* Language ID */
  languageId: string
}

interface UpdateLayoutParams {
  /* Product Detail ID */
  productDetailId: string

  /* Layout Type */
  layoutType: number

  /* Development Component Name */
  devComponentName?: string

  /* Layout Content */
  layoutContent?: string
}

interface UpdateParameterParams {
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
