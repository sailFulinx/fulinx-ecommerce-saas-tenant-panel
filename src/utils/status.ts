import { statuses } from '@/data/status'

/**
 * 转换订单状态为文字
 * @param val
 * @returns
 */
export function convertStatus(val: boolean) {
  const valResult = val ? 1 : 0
  let label = ''
  statuses.map(item => {
    if (item.id === valResult) {
      label = item.label
    }
  })
  return label
}
