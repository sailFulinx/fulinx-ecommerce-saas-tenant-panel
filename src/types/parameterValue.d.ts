interface RemoveParameterValueParams {
  /* Parameter ID */
  parameterId: string

  /* Language ID */
  languageId: string

  /* Parameter Value Ids */
  parameterValueIds: string[]
}

interface ParameterValueListParams {
  /* Language ID */
  languageId: string

  /* Parameter ID */
  parameterId?: string

  /* Parameter Name */
  parameterName?: string

  /* Parameter Type */
  parameterType?: number

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface ParameterValueListData {
  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Language ID */
  languageId: string

  /* Parameter Value Content */
  parameterValueContent: string
}

interface CreateParameterValueBatchParams {
  /* Language ID */
  languageId: string

  /* Parameter ID */
  parameterId: string

  /* Parameter Value Contents */
  parameterValueContents: string[]
}

interface CreateParameterValueContentParams {
  /* Parameter Value ID */
  parameterValueId: string

  /* Language ID */
  languageId: string

  /* Parameter Value Content */
  parameterValueContent: string
}

interface UpdateParameterValueStatusParams {
  /* Parameter Value ID */
  parameterValueId: string

  /* Status */
  status: boolean

  /* Language ID */
  languageId: string
}

interface UpdateParameterValueSortParams {
  /* Parameter Value ID */
  parameterValueId: string

  /* Language ID */
  languageId: string

  /* Sort */
  sort?: number
}

interface UpdateParameterValueContentParams {
  /* Parameter Value Detail ID */
  parameterValueDetailId: string

  /* Parameter Value Content */
  parameterValueContent: string
}
