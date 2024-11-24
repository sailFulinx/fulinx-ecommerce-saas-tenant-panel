const useSleep = (ms = 0) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms)
  })
}

const useWaitRef = async (ref: any, maxRetries = 10, interval = 100) => {
  let retries = 0
  while (!ref.value && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, interval)) // 每次等待指定的时间
    retries++
  }
  return ref.value // 返回最后的值，无论是否获取到
}

export { useSleep, useSleep as $sleep, useWaitRef }
