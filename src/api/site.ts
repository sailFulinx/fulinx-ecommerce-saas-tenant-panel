import request from '@/utils/axios'

export function createSite(data: SiteRequest): Promise<IResponse<SiteData & CommonField>> {
  return request.post({
    url: 'system/site',
    data,
    token: true,
  })
}

export function removeSite(data: SiteRemoveRequest): Promise<IResponse<SiteData & CommonField>> {
  return request.delete({
    url: 'system/site',
    data,
    token: true,
  })
}

export function editSite(id: string, data: SiteRequest): Promise<IResponse<SiteData & CommonField>> {
  return request.put({
    url: `system/site/${id}`,
    data,
    token: true,
  })
}

export function showSite(id: string): Promise<IResponse<SiteData & CommonField>> {
  return request.get({
    url: `system/site/${id}`,
    token: true,
  })
}

export function sitePagination(
  data: SiteListParams & Pagination,
): Promise<IResponse<TableResponse<SiteData & CommonField>>> {
  return request.post({
    url: 'system/site/pagination',
    data,
    token: true,
  })
}

export function siteConfigMailSetting(data: SiteConfigMailSetting): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/site/config/mail/setting',
    data,
    token: true,
  })
}

export function fetchSiteConfigMailSetting(id: string): Promise<IResponse<boolean>> {
  return request.get({
    url: `system/site/config/mail/view/${id}`,
    token: true,
  })
}
