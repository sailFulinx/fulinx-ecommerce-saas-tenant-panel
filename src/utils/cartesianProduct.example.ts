import { cartesianProduct, cartesianProductToString } from './cartesianProduct'

// 示例1：颜色和尺寸的笛卡尔积
const colors = ['红色', '绿色', '黄色']
const sizes = ['S', 'M', 'L']

console.log('示例1：颜色和尺寸的笛卡尔积')
const product1 = cartesianProduct([colors, sizes])
console.log(product1)
// 输出：
// [
//   ['红色', 'S'], ['红色', 'M'], ['红色', 'L'],
//   ['绿色', 'S'], ['绿色', 'M'], ['绿色', 'L'],
//   ['黄色', 'S'], ['黄色', 'M'], ['黄色', 'L']
// ]

console.log('\n示例2：使用默认分隔符的字符串格式化')
const productToString1 = cartesianProductToString([colors, sizes])
console.log(productToString1)
// 输出：
// ['红色-S', '红色-M', '红色-L', '绿色-S', '绿色-M', '绿色-L', '黄色-S', '黄色-M', '黄色-L']

console.log('\n示例3：三个数组的笛卡尔积')
const materials = ['棉', '涤纶']
const product2 = cartesianProduct([colors, sizes, materials])
console.log(product2)
// 输出：
// [
//   ['红色', 'S', '棉'], ['红色', 'S', '涤纶'],
//   ['红色', 'M', '棉'], ['红色', 'M', '涤纶'],
//   ['红色', 'L', '棉'], ['红色', 'L', '涤纶'],
//   ['绿色', 'S', '棉'], ['绿色', 'S', '涤纶'],
//   ['绿色', 'M', '棉'], ['绿色', 'M', '涤纶'],
//   ['绿色', 'L', '棉'], ['绿色', 'L', '涤纶'],
//   ['黄色', 'S', '棉'], ['黄色', 'S', '涤纶'],
//   ['黄色', 'M', '棉'], ['黄色', 'M', '涤纶'],
//   ['黄色', 'L', '棉'], ['黄色', 'L', '涤纶']
// ]

console.log('\n示例4：使用自定义分隔符')
const productToString2 = cartesianProductToString([colors, sizes], ':')
console.log(productToString2)
// 输出：
// ['红色:S', '红色:M', '红色:L', '绿色:S', '绿色:M', '绿色:L', '黄色:S', '黄色:M', '黄色:L']

console.log('\n示例5：处理空数组的情况')
const emptyProduct = cartesianProduct([colors, [], sizes])
console.log(emptyProduct) // 输出：[]
