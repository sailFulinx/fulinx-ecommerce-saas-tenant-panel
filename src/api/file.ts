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
