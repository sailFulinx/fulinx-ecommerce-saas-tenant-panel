export const categoryTypes = [
  {
    id: 1,
    code: 'product',
    label: '产品',
    type: 'primary',
  },
  {
    id: 2,
    code: 'article',
    label: '文章',
    type: 'warning',
  },
]

// 使用id获取label
export function getCategoryTypeLabel(id: number) {
  return categoryTypes.find(item => item.id === id)?.label
}

export function getCategoryTypeColor(id: number) {
  return categoryTypes.find(item => item.id === id)?.type
}
