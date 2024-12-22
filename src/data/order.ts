export const orderApprovalStatuses = [
  {
    id: 0,
    label: '暂未审核',
  },
  {
    id: 1,
    label: '审核通过',
  },
  {
    id: 2,
    label: '审核拒绝',
  },
]

export const orderStatuses = [
  {
    id: 1,
    code: 'unpaid',
    label: '未支付',
  },
  {
    id: 2,
    code: 'pending',
    label: '待处理',
  },
  {
    id: 3,
    code: 'paid_unconfirmed',
    label: '已支付未确认',
  },
  {
    id: 4,
    code: 'paid_confirmed',
    label: '已支付已确认',
  },
  {
    id: 5,
    code: 'paid',
    label: '已支付',
  },
  {
    id: 6,
    code: 'processing',
    label: '处理中',
  },
  {
    id: 7,
    code: 'shipped',
    label: '已发货',
  },
  {
    id: 8,
    code: 'delivered',
    label: '已送达',
  },
  {
    id: 9,
    code: 'completed',
    label: '已完成',
  },
  {
    id: 10,
    code: 'cancelled',
    label: '已取消',
  },
  {
    id: 11,
    code: 'returned',
    label: '已退货',
  },
  {
    id: 12,
    code: 'refunded',
    label: '已退款',
  },
  {
    id: 13,
    code: 'failed',
    label: '失败',
  },
]

// 根据id返回Label
export function getOrderStatusLabel(id: number) {
  return orderStatuses.find(item => item.id === id)?.label
}
