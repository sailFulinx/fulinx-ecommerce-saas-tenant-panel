interface CreateParameterParams {
  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number

  /* Language ID */
  languageId: string

  /* Parameter Name */
  parameterName: string
}

interface CreateParameterRes {
  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number
}

interface RemoveParameterParams {
  /* Parameter Ids */
  parameterIds: string[]
}

interface CreateParameterDetailParams {
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

interface ParameterShow {
  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number
  /* */
  parameterDetailListResultDo: ParameterDetailListResultDo & CommonField

}

interface UpdateParameterDetailParameterNameParams {
  /* Parameter Detail ID */
  parameterDetailId: string

  /* Parameter Name */
  parameterName: string
}

interface ParameterListParams {
  /* Language ID */
  languageId: string

  /* Parameter Id */
  parameterId?: string

  /* Parameter Name */
  parameterName?: string
  /* 删除标识 */
  isDelete?: number
}

interface ParameterListData {
  /* Parameter ID */
  id: string

  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number

  /* Language ID */
  languageId: string

  /* Parameter Name */
  parameterName: string
}

interface ShowParameterParams {
  /* Parameter Id */
  parameterId: string

  /* Language ID */
  languageId: string
}

interface CreateParameterGroupParams {
  /* Language ID */
  languageId: string

  /* Parameter Group Name */
  parameterGroupName: string
}

interface CreateParameterGroupRes {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean
}

interface RemoveParameterGroupParams {
  /* Parameter Group Ids */
  parameterGroupIds: string[]
}

interface CreateParameterGroupParameterRelationParams {
  /* Parameter Group ID */
  parameterGroupId: string

  /* Language ID */
  languageId: string

  /* Parameter ID List */
  parameterIds: string[]
}

interface ParameterGroupDetailListResultDo {

  /* Parameter Group ID */
  parameterGroupId: string

  /* Language ID */
  languageId: string

  /* Parameter Group Name */
  parameterGroupName: string
}

interface ParameterGroupParameterRelationListResultDo {

  /* Parameter Group ID */
  parameterGroupId: string

  /* Parameter ID */
  parameterId: string
}

interface ParameterGroupShow {
  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* */
  parameterGroupDetailListResultDo: ParameterGroupDetailListResultDo & CommonField

  /* Parameter Group List Result Dos */
  parameterGroupParameterRelationListResultDos: (ParameterGroupParameterRelationListResultDo & CommonField)[]
}

interface CreateParameterGroupDetailParams {
  /* Parameter Group ID */
  parameterGroupId: string

  /* Language ID */
  languageId: string

  /* Parameter Group Name */
  parameterGroupName: string
}

interface UpdateParameterGroupDetailParameterGroupName {
  /* Parameter Group Detail ID */
  parameterGroupDetailId: string

  /* Parameter Group Name */
  parameterGroupName: string
}

interface ParameterGroupListParams {
  /* Parameter Group ID */
  parameterGroupId?: string

  /* Language ID */
  languageId: string

  /* Parameter Group Name */
  parameterGroupName?: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status?: boolean
}

interface ParameterGroupListData {

  /* Parameter Group Name */
  parameterGroupName: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean
}

interface ShowParameterGroupParams {
  /* Parameter Group Id */
  parameterGroupId: string

  /* Language ID */
  languageId: string
}

interface UpdateParameterGroupStatusParams {
  /* Parameter Group Id */
  parameterGroupId?: string

  /* status */
  status: boolean

  /* Language ID */
  languageId: string
}

interface UpdateParameterTypeParams {
  /* Parameter Id */
  parameterId: string

  /* Parameter Type, 1-Select, 2-Input, 3-Boolean */
  parameterType: number

  /* Language ID */
  languageId: string
}

interface CreateParameterValueParams {
  /* Language ID */
  languageId: string

  /* Parameter Value Content */
  parameterValueContent: string
}

interface CreateParameterValueRes {

}

interface RemoveParameterValueParams {
  /* Parameter Value Ids */
  parameterValueIds: string[]
}

interface CreateParameterValueDetailParams {
  /* Parameter Value ID */
  parameterValueId: string

  /* Language ID */
  languageId: string

  /* Parameter Value Content */
  parameterValueContent: string
}

interface ParameterValueDetailListResultDo {

  /* Parameter Value ID */
  parameterValueId: string

  /* Language ID */
  languageId: string

  /* Attribute Value Name */
  parameterValueContent: string

};

interface ParameterValueShow {
  parameterValueDetailListResultDo: ParameterValueDetailListResultDo & CommonField
}

interface UpdateParameterValueContentParams {
  /* Parameter Value Detail ID */
  parameterValueDetailId: string

  /* Parameter Value Content */
  parameterValueContent: string

  /* Language ID */
  languageId: string
}

interface ParameterValueListParams {
  /* Parameter Value ID */
  parameterValueId?: string

  /* Language ID */
  languageId: string

  /* 删除标识 */
  isDelete?: number
}

interface ParameterValueListData {
  /* Language ID */
  languageId: string

  /* Parameter Value Content */
  parameterValueContent: string
}

interface ShowParameterValueParams {
  /* Parameter Value Id */
  parameterValueId: string

  /* Language ID */
  languageId: string
}
