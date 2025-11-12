/**
 * 动态组件
 */
// 动态导入所有组件
const componentModules = import.meta.glob('@/components/Element/*.vue')
// 动态获取组件
export const getComponent = (elementComponentCode: string) => {
  console.log('getComponent', elementComponentCode)
  const componentPath = `/src/components/Element/${elementComponentCode}.vue`
  if (componentModules[componentPath]) {
    return defineAsyncComponent(componentModules[componentPath] as () => Promise<any>)
  } else {
    console.error(`Component not found: ${elementComponentCode}`)
    return null
  }
}
