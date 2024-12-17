import request from '@/utils/axios'

export function createCouponApi(data: CreateCouponParams): Promise<IResponse<CouponListData & CommonField>> {
  return request.post({
    url: 'system/coupon',
    data,
    token: true,
  })
}

export function removeCouponApi(data: RemoveCouponParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/coupon',
    data,
    token: true,
  })
}

export function updateCouponNameApi(data: UpdateCouponNameParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/name',
    data,
    token: true,
  })
}

export function updateCouponEndedTimeApi(data: UpdateCouponEndedTimeParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/ended/time',
    data,
    token: true,
  })
}

export function updateCouponStartedTimeApi(data: UpdateCouponStartedTimeParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/started/time',
    data,
    token: true,
  })
}

export function updateCouponIssueCountApi(data: UpdateCouponIssueCountParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/issue/count',
    data,
    token: true,
  })
}

export function updateCouponRuleTypeApi(data: UpdateCouponRuleTypeParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/rule/type',
    data,
    token: true,
  })
}

export function updateCouponRuleRetentionCycleApi(data: UpdateCouponRuleRetentionCycleParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/rule/retention/cycle',
    data,
    token: true,
  })
}

export function updateCouponStatusApi(data: UpdateCouponStatusParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/status',
    data,
    token: true,
  })
}

export function updateCouponDescriptionApi(data: UpdateCouponDescriptionParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/description',
    data,
    token: true,
  })
}

export function updateCouponTypeApi(data: UpdateCouponTypeParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/type',
    data,
    token: true,
  })
}

export function updateCouponValueApi(data: UpdateCouponValueParams): Promise<IResponse<boolean>> {
  return request.post({
    url: 'system/coupon/update/value',
    data,
    token: true,
  })
}

export function showCouponApi(id: string): Promise<IResponse<CouponListData & CommonField>> {
  return request.get({
    url: `system/coupon/${id}`,
    token: true,
  })
}

export function couponListApi(
  params: CouponListParams,
): Promise<IResponse<TableResponse<CouponListData & CommonField>>> {
  return request.post({
    url: 'system/coupon/list',
    data: params,
    token: true,
  })
}

export function couponPaginationApi(
  params: CouponListParams & Pagination,
): Promise<IResponse<TableResponse<CouponListData & CommonField>>> {
  return request.post({
    url: 'system/coupon/pagination',
    data: params,
    token: true,
  })
}
