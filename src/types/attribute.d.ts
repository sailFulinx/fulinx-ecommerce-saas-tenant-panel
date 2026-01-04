interface CreateAttributeParams {
  /* Attribute Type, 1-Select, 2-Input, 3-Boolean */
  attributeType: number

  /* Language ID */
  languageId: string

  /* Attribute Name */
  attributeName: string
}

interface CreateAttributeRes {
  /* Attribute Type, 1-Select, 2-Input, 3-Boolean */
  attributeType: number

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean
}

interface CreateAttributeNameParams {
  /* Attribute ID */
  attributeId: string

  /* Language ID */
  languageId: string

  /* Attribute Name */
  attributeName: string
}

interface AttributeDetailListResultDo {
  /* Attribute ID */
  attributeId: string

  /* Language ID */
  languageId: string

  /* Attribute Name */
  attributeName: string
}

interface AttributeAdminLocalizedViewDo {
  /* Language ID */
  languageId: string

  /* Language Name */
  languageName: string

  /* Language Code */
  languageCode: string

  /* */
  attributeDetailListResultDo: (AttributeDetailListResultDo & CommonField) | null
}

interface AttributeShowData {
  /* Attribute Type, 1-Select, 2-Input, 3-Boolean */
  attributeType: number | null

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Attribute Admin Localized View Dos */
  attributeAdminLocalizedViewDos: AttributeAdminLocalizedViewDo[]
}

interface RemoveAttributeParams {
  /* Attribute Ids */
  attributeIds: string[]
}

interface AttributeListParams {
  /* Language ID */
  languageId: string

  /* Attribute Id */
  attributeId?: string | null

  /* 属性标题 */
  attributeName?: string | null

  attributeType?: number | null

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface AttributeValueListResultDo {
  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Language ID */
  languageId: string

  /* Attribute Value Content */
  attributeValueContent: string
}

interface AttributeListData {
  /* Attribute Type, 1-Select, 2-Input, 3-Boolean */
  attributeType: number

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Language ID */
  languageId: string

  /* Attribute Name */
  attributeName: string

  /* Attribute Value List Result Dos */
  attributeValueListResultDos: (AttributeValueListResultDo & CommonField)[]
}

interface ShowAttributeParams {
  /* Attribute Id */
  attributeId: string

  /* Language ID */
  languageId: string
}

interface UpdateAttributeNameParams {
  /* Attribute Detail ID */
  attributeDetailId: string

  /* Attribute Name */
  attributeName: string
}

interface UpdateAttributeSortParams {
  /* Attribute ID */
  attributeId: string

  /* Language ID */
  languageId: string

  /* Sort */
  sort?: number
}

interface UpdateAttributeStatusParams {
  /* Attribute ID */
  attributeId: string

  /* Status */
  status: boolean

  /* Language ID */
  languageId: string
}
