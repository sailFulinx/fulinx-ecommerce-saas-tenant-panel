interface FileData {
  id?: string
  isDefault?: boolean
  uid?: number
  sort?: number
  /* Remote Type, 1-Local, 2-Aliyun, 3-Amazon */
  fileRemoteType?: number

  /* Bucket */
  bucket?: string

  /* Original Path */
  uploadPath: string

  /* Original File Name */
  originalFileName: string

  fileId?: string

  /* File Name */
  fileName: string

  /* File Content Type */
  fileContentType: string

  /* File Extension Name */
  fileExtensionName: string

  /* File Width */
  fileWidth?: number

  /* File Height */
  fileHeight?: number

  /* Etag */
  etag?: string

  /* Bucket Key */
  bucketKey?: string

  /* File Url */
  fileUrl: string

  /* sha256 */
  sha256: string
}

interface FileListParams {
  /* File Original Name */
  fileOriginalName?: string | null
}

interface RemoveFileParams {
  ids: string[]
}
