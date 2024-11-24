import request from '@/utils/axios'

export function createTheme(data: ThemeRequest): Promise<IResponse<ThemeData & CommonField>> {
  return request.post({
    url: 'system/theme',
    data,
    token: true,
  })
}

export function removeTheme(data: ThemeRemoveRequest): Promise<IResponse<ThemeData & CommonField>> {
  return request.delete({
    url: 'system/theme',
    data,
    token: true,
  })
}

export function editTheme(id: number, data: ThemeRequest): Promise<IResponse<ThemeData & CommonField>> {
  return request.put({
    url: `system/theme/${id}`,
    data,
    token: true,
  })
}

export function editThemeConfig(id: number, data: ThemeConfigRequest): Promise<IResponse<ThemeData & CommonField>> {
  return request.put({
    url: `system/theme/config/${id}`,
    data,
    token: true,
  })
}

export function showTheme(id: number): Promise<IResponse<ThemeData & CommonField>> {
  return request.get({
    url: `system/theme/${id}`,
    token: true,
  })
}

export function themePagination(
  data: ThemeListParams & Pagination,
): Promise<IResponse<TableResponse<ThemeData & CommonField>>> {
  return request.post({
    url: 'system/theme/pagination',
    data,
    token: true,
  })
}

export function themeList(data: ThemeListParams): Promise<IResponse<TableResponse<ThemeData & CommonField>>> {
  return request.post({
    url: 'system/theme/list',
    data,
    token: true,
  })
}
