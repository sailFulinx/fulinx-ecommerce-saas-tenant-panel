import request from '@/utils/axios'

export function fetchLanguageListApi(data?: LanguageListParams) {
  return request.post<IResponse<ListLanguageRes>>({
    url: 'share/public/language/list',
    data,
  })
}
