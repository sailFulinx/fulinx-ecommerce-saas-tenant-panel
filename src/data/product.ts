export const productTypes = [
  {
    id: 1,
    label: '简单产品',
    code: 'simple',
  },
  {
    id: 2,
    label: '可配置产品',
    value: 'configurable',
  },
  {
    id: 3,
    label: '虚拟产品',
    value: 'virtual',
  },
]

export const productStockStatusTypes = [
  {
    id: 1,
    label: '在库',
    code: 'InStock',
  },
  {
    id: 2,
    label: '缺货',
    value: 'OutOfStock',
  },
  {
    id: 3,
    label: '预购',
    value: 'PreOrder',
  },
  {
    id: 4,
    label: '延迟发货',
    value: 'BackOrder',
  },
]

// 根据id返回Label
export function getLabel(id: number, array: any[]) {
  return array.find(item => item.id === id)?.label
}
