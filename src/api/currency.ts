import request from '@/utils/axios'

export function fetchCurrencyListApi(data?: CurrencyListParams): Promise<IResponse<TableResponse<CurrencyData & CommonField>>> {
  return request.post({
    url: 'share/public/currency/list',
    data,
  })
}
