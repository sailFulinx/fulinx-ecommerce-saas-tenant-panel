interface CreateParameterParams {
  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number | null

  /* Language ID */
  languageId: string

  /* Parameter Name */
  parameterName: string
}

interface CreateParameterRes {
  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean
}

interface CreateParameterNameParams {
  /* Parameter ID */
  parameterId: string

  /* Language ID */
  languageId: string

  /* Parameter Name */
  parameterName: string
}

interface ParameterDetailListResultDo {
  /* Parameter ID */
  parameterId: string

  /* Language ID */
  languageId: string

  /* Parameter Name */
  parameterName: string
}

interface ParameterValueDetailVo {
  /* Parameter Value ID */
  parameterValueId: string

  /* Parameter ID */
  parameterId: string

  /* Language ID */
  languageId: string

  /* Parameter Value Content */
  parameterValueContent: string

  /* Is Default */
  isDefault: boolean

  /* Default Parameter Value Content */
  defaultParameterValueContent: string
}

interface ParameterValueResultDo {
  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* */
  parameterValueDetailVo: ParameterValueDetailVo & CommonField
}

interface ParameterAdminLocalizedViewDo {
  /* Language ID */
  languageId: string

  /* Language Name */
  languageName: string

  /* Language Code */
  languageCode: string

  /* */
  parameterDetailListResultDo: (ParameterDetailListResultDo & CommonField) | null

  /* Parameter Value Result Dos */
  parameterValueResultDos: (ParameterValueResultDo & CommonField)[]
}

interface ParameterShowData {
  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number | null

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Parameter Admin Localized View Dos */
  parameterAdminLocalizedViewDos: ParameterAdminLocalizedViewDo[]
}

interface RemoveParameterParams {
  /* Parameter Ids */
  parameterIds: string[]
}

interface ParameterListParams {
  /* Language ID */
  languageId: string

  /* Parameter Id */
  parameterId?: string | null

  /* 属性标题 */
  parameterName?: string | null

  parameterType?: number | null

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface ParameterValueListResultDo {
  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Language ID */
  languageId: string

  /* Parameter Value Content */
  parameterValueContent: string
}

interface ParameterListData {
  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Language ID */
  languageId: string

  /* Parameter Name */
  parameterName: string

  /* Parameter Value List Result Dos */
  parameterValueListResultDos: (ParameterValueListResultDo & CommonField)[]
}

interface ShowParameterParams {
  /* Parameter Id */
  parameterId: string

  /* Language ID */
  languageId: string
}

interface UpdateParameterNameParams {
  /* Parameter Detail ID */
  parameterDetailId: string

  /* Parameter Name */
  parameterName: string
}

interface UpdateParameterSortParams {
  /* Parameter ID */
  parameterId: string

  /* Language ID */
  languageId: string

  /* Sort */
  sort?: number
}

interface UpdateParameterStatusParams {
  /* Parameter ID */
  parameterId: string

  /* Status */
  status: boolean

  /* Language ID */
  languageId: string
}
