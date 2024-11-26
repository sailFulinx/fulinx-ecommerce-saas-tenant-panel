export const parameterTypes = [
  {
    id: 1,
    label: '选择器',
    code: 'select',
  },
  {
    id: 2,
    label: '输入框',
    value: 'input',
  },
]

// 根据id返回Label
export function getParameterTypeLabel(id: number) {
  return parameterTypes.find(item => item.id === id)?.label
}
