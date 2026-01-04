interface RemoveAttributeValueParams {
  /* Attribute ID */
  attributeId: string

  /* Language ID */
  languageId: string

  /* Attribute Value Ids */
  attributeValueIds: string[]
}

interface AttributeValueListParams {
  /* Language ID */
  languageId: string

  /* Attribute ID */
  attributeId?: string

  /* Attribute Name */
  attributeName?: string

  /* Attribute Type */
  attributeType?: number

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface AttributeValueListData {
  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Language ID */
  languageId: string

  /* Attribute Value Content */
  attributeValueContent: string
}

interface CreateAttributeValueBatchParams {
  /* Language ID */
  languageId: string

  /* Attribute ID */
  attributeId: string

  /* Attribute Value Contents */
  attributeValueContents: string[]
}

interface CreateAttributeValueContentParams {
  /* Attribute Value ID */
  attributeValueId: string

  /* Language ID */
  languageId: string

  /* Attribute Value Content */
  attributeValueContent: string
}

interface UpdateAttributeValueStatusParams {
  /* Attribute Value ID */
  attributeValueId: string

  /* Status */
  status: boolean

  /* Language ID */
  languageId: string
}

interface UpdateAttributeValueSortParams {
  /* Attribute Value ID */
  attributeValueId: string

  /* Language ID */
  languageId: string

  /* Sort */
  sort?: number
}

interface UpdateAttributeValueContentParams {
  /* Attribute Value Detail ID */
  attributeValueDetailId: string

  /* Attribute Value Content */
  attributeValueContent: string
}
