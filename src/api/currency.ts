import request from '@/utils/axios'

export function currencyListApi(data?: CurrencyListParams): Promise<IResponse<TableResponse<CurrencyData & CommonField>>> {
  return request.post({
    url: 'share/public/currency/list',
    data,
    token: true,
  })
}
