import request from '@/utils/axios'

export function saveSettingApi(id: number, data: SaveSettingType): Promise<IResponse<SettingData & CommonField>> {
  return request.post({
    url: `system/setting/${id}`,
    data,
    token: true,
  })
}

export function showSettingApi(id: number): Promise<IResponse<SettingData & CommonField>> {
  return request.get({
    url: `system/setting/${id}`,
    token: true,
  })
}
