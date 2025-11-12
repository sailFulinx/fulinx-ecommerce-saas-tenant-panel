/**
 * 快速重置一个 boolean ref
 * @param {Ref<boolean>} initialValue - boolean ref
 * @param { boolean } track - debugger
 * @returns handler function
 */
const useFlashy = (initialValue: Ref<boolean>, track = false) => {
  return () => {
    initialValue.value = !initialValue.value
    track && log(`before: ${initialValue.value}`)
    nextTick(() => {
      initialValue.value = !initialValue.value
      track && log(`after: ${initialValue.value}`)
    })
  }
}
export { useFlashy as $flashy, useFlashy }
