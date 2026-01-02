import request from '@/utils/axios'

/**
 * 上传图片
 * @param id
 * @returns
 */
export function uploadFileApi(data: any, config?: any): Promise<IResponse> {
  return request.post({
    url: 'system/file/s3',
    token: true,
    data,
    headersType: 'multipart/form-data',
    ...config,
  })
}

export function filePaginationApi(
  params: FileListParams & Pagination,
): Promise<IResponse<TableResponse<FileListData & CommonField>>> {
  return request.post({
    url: 'system/file/pagination',
    data: params,
    token: true,
  })
}

export function removeFileApi(params: RemoveFileParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/file',
    data: params,
    token: true,
  })
}
