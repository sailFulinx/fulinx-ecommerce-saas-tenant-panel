import request from '@/utils/axios'

export function removeMessageApi(data: RemoveMessageParams): Promise<IResponse<MessageData & CommonField>> {
  return request.delete({
    url: 'system/message',
    data,
    token: true,
  })
}

export function showMessageApi(id: string): Promise<IResponse<MessageData & CommonField>> {
  return request.get({
    url: `system/message/${id}`,
    token: true,
  })
}

export function messagePaginationApi(
  data: MessageListParams & Pagination,
): Promise<IResponse<TableResponse<MessageData & CommonField>>> {
  return request.post({
    url: 'system/message/pagination',
    data,
    token: true,
  })
}
