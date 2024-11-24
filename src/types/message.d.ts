interface MessageData {
  /* Message ID */
  id: string

  /* Full Name */
  fullName: string

  /* Email */
  email: string

  /* Telephone */
  telephone: string

  /* Message Content */
  messageContent: string

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

interface RemoveMessageParams {
  ids: string[]
}

interface MessageListParams {
  /* Message ID */
  id?: number

  /* Full Name */
  fullName?: string

  /* Email */
  email?: string

  /* Telephone */
  telephone?: string

  recordCreateTimeStart?: string

  recordCreateTimeEnd?: string

  recordCreateTimeRange?: string[]

  /* Soft Delete Flag */
  isDelete?: number
}
