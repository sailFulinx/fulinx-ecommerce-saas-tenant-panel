/**
 * 计算多个数组的笛卡尔积
 *
 * @param arrays 需要计算笛卡尔积的数组集合
 * @returns 笛卡尔积结果数组
 *
 * 示例：
 * cartesianProduct([['红色', '绿色'], ['S', 'M']])
 * // [['红色', 'S'], ['红色', 'M'], ['绿色', 'S'], ['绿色', 'M']]
 */
export function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (!arrays || arrays.length === 0) {
    return []
  }

  // 检查是否有空数组，如果有则返回空数组
  if (arrays.some(arr => arr.length === 0)) {
    return []
  }

  // 使用 reduce 方法累积计算笛卡尔积
  return arrays.reduce<T[][]>((acc, curr) => {
    // 如果累积数组为空，则初始化为包含一个空数组的数组
    if (acc.length === 0) {
      return curr.map(item => [item])
    }

    // 计算当前累积数组和当前数组的笛卡尔积
    const result: T[][] = []
    acc.forEach(accItem => {
      curr.forEach(currItem => {
        result.push([...accItem, currItem])
      })
    })

    return result
  }, [] as T[][])
}

/**
 * 将笛卡尔积的结果格式化为字符串数组
 *
 * @param arrays 需要计算笛卡尔积的数组集合
 * @param separator 分隔符，默认为 '-'
 * @returns 格式化后的字符串数组
 *
 * 示例：
 * cartesianProductToString([['红色', '绿色'], ['S', 'M']])
 * // ['红色-S', '红色-M', '绿色-S', '绿色-M']
 */
export function cartesianProductToString<T extends string | number>(arrays: T[][], separator = '-'): string[] {
  const product = cartesianProduct(arrays)
  return product.map(items => items.join(separator))
}
