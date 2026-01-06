export const parameterTypes = [
  {
    id: 1,
    label: '选择器',
    value: 'select',
  },
  {
    id: 2,
    label: '输入框',
    value: 'input',
  },
  {
    id: 3,
    label: '布尔值',
    value: 'boolean',
  },
]

// 根据id返回Label
export function getParameterTypeLabel(id: number) {
  return parameterTypes.find(item => item.id === id)?.label
}
