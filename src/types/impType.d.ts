type ImpListResponseDataType = {
  fileId: string
  id: string
  importStatus: number
  importType: number
} & CommonField

interface ImpRequestQueryParameterType {}

type ImpLogResponseDataType = {
  fileId: string
  fileVo: {
    fileContentType: string
    fileExtensionName: string
    fileName: string
    fileUrl: string
    id: string
    isDelete: number
    originalFileName: string
    path: string
    recordCreateName: string
    recordCreateTime: Record<string, unknown>
    recordUpdateName: string
    recordUpdateTime: Record<string, unknown>
    recordVersion: number
    remark: string
    sha256: string
  } | null
  id: string
  importLogList: {
    FileId: string
    id: string
    impContent: string
    impFailedReason: string
    impId: string
    impLogStatus: number
    isDelete: number
    recordCreateName: string
    recordCreateTime: Record<string, unknown>
    recordUpdateName: string
    recordUpdateTime: Record<string, unknown>
    recordVersion: number
    remark: string
  }[]
  importStatus: number
  importType: number
} & CommonField
