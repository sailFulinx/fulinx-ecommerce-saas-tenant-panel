export const parameterTypes = [
  {
    id: 1,
    label: '选择',
    code: 'select',
  },
  {
    id: 2,
    label: '输入',
    value: 'input',
  },
  {
    id: 3,
    label: '布尔',
    value: 'boolean',
  },
]

// 根据id返回Label
export function getParameterTypeLabel(id: number) {
  return parameterTypes.find(item => item.id === id)?.label
}
