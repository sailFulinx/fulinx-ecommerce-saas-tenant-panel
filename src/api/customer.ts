import request from '@/utils/axios'

export function showCustomerApi(id: string): Promise<IResponse<CustomerShowData & CommonField>> {
  return request.get({
    url: `system/customer/show/${id}`,
    token: true,
  })
}

export function customerListApi(
  params: CustomerListParams,
): Promise<IResponse<TableResponse<CustomerListData & CommonField>>> {
  return request.post({
    url: 'system/customer/list',
    data: params,
    token: true,
  })
}

export function customerPaginationApi(
  params: CustomerListParams & Pagination,
): Promise<IResponse<TableResponse<CustomerListData & CommonField>>> {
  return request.post({
    url: 'system/customer/pagination',
    data: params,
    token: true,
  })
}

export function showCustomerInvoiceApi(id: string): Promise<IResponse<CustomerInvoiceShowData & CommonField>> {
  return request.get({
    url: `system/customer/invoice/show/${id}`,
    token: true,
  })
}

export function approvalCustomerInvoiceApi(
  data: ApprovalCustomerInvoiceParams,
): Promise<IResponse<CustomerInvoiceShowData & CommonField>> {
  return request.post({
    url: 'system/customer/invoice/approval',
    data,
    token: true,
  })
}

export function uploadCustomerInvoiceApi(
  data: ApprovalCustomerInvoiceUploadParams,
): Promise<IResponse<CustomerInvoiceShowData & CommonField>> {
  return request.post({
    url: 'system/customer/invoice/upload',
    data,
    token: true,
  })
}

export function customerInvoiceListApi(
  params: CustomerInvoiceListParams,
): Promise<IResponse<TableResponse<CustomerInvoiceListData & CommonField>>> {
  return request.post({
    url: 'system/customer/invoice/list',
    data: params,
    token: true,
  })
}

export function customerInvoicePaginationApi(
  params: CustomerInvoiceListParams & Pagination,
): Promise<IResponse<TableResponse<CustomerInvoiceListData & CommonField>>> {
  return request.post({
    url: 'system/customer/invoice/pagination',
    data: params,
    token: true,
  })
}
