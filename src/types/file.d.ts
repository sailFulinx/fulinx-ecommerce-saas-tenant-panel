interface FileData {
  /* File ID */
  id: string

  /* Bucket Name */
  bucketName: string

  /* Etag */
  etag: string

  /* S3 Key */
  s3Key: string

  /* Is Public */
  isPublic: boolean

  /* Original File Name */
  originalFileName: string

  /* File Name */
  fileName: string

  /* File Content Type */
  fileContentType: string

  /* File Extension Name */
  fileExtensionName: string

  /* Path */
  path: string

  /* File Url */
  fileUrl: string

  /* sha256 */
  sha256: string

  sort?: number
}

interface FileListParams {
  /* File Original Name */
  originalFileName?: string | undefined
}

interface RemoveFileParams {
  ids: string[]
}

interface FileListData {
  /* Bucket Name */
  bucketName: string

  /* Etag */
  etag: string

  /* S3 Key */
  s3Key: string

  /* Is Public */
  isPublic: boolean

  /* Original File Name */
  originalFileName: string

  /* File Name */
  fileName: string

  /* File Content Type */
  fileContentType: string

  /* File Extension Name */
  fileExtensionName: string

  /* Path */
  path: string

  /* File Url */
  fileUrl: string

  /* sha256 */
  sha256: string
}
