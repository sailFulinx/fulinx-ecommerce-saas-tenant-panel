import request from '@/utils/axios'

/**
 * 上传图片
 * @param id
 * @returns
 */
export function uploadFileApi(data: any, config?: any): Promise<IResponse> {
  return request.post({
    url: 'system/file',
    token: true,
    data,
    headersType: 'multipart/form-data',
    ...config,
  })
}

export function uploadFileZipApi(data: any, config?: any): Promise<IResponse> {
  return request.post({
    url: 'system/file/zip',
    token: true,
    data,
    headersType: 'multipart/form-data',
    ...config,
  })
}

/**
 * 文件列表- 带分页
 * @param {object} params 文件分页查询参数
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.id File ID
 * @param {string} params.fileOriginalName File Original Name
 * @param {number} params.fileType File Type
 * @param {number} params.isDelete Soft Delete Flag
 * @returns
 */
export function filePaginationApi(params: FileListParams): Promise<IResponse<TableResponse<FileData & CommonField>>> {
  return request.post({
    url: 'system/file/pagination',
    token: true,
    data: params,
  })
}

/**
 * 删除文件
 * @param {object} params FileDeleteVo
 * @param {Array} params.ids File Ids
 * @returns
 */
export function removeFileApi(params: RemoveFileParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/file',
    token: true,
    data: params,
  })
}
