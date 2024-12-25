export const customerInvoiceTypes = [
  {
    id: 1,
    label: '增值税普通发票',
  },
  {
    id: 2,
    label: '增值税专用发票',
  },
]

export const customerInvoiceApprovalStatuses = [
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
  {
    id: 3,
    label: '已开具',
  },
  {
    id: 4,
    label: '已作废',
  },
]

// 根据id获取label
export function getCustomerInvoiceTypeLabel(id: number) {
  return customerInvoiceTypes.find(item => item.id === id)?.label
}
