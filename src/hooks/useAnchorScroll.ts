import { nextTick, onMounted, onUnmounted, ref } from 'vue'

interface AnchorScrollOptions {
  containerRef?: HTMLElement | null
  sections: string[]
}

export const useAnchorScroll = (options: AnchorScrollOptions) => {
  const { containerRef, sections } = options

  // 添加响应式变量来跟踪当前激活的锚点
  const currentHref = ref(`#${sections[0]}`)

  // 添加函数来检测当前滚动位置对应的锚点
  const updateCurrentHref = () => {
    // 如果使用容器滚动
    if (containerRef) {
      const scrollPosition = containerRef.scrollTop + 100 // 添加偏移量以便提前识别

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const height = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            currentHref.value = `#${section}`
            return
          }
        }
      }
      return
    }

    // 使用页面滚动
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

    // 如果滚动到页面顶部（接近0的位置），则激活第一个锚点
    if (scrollPosition <= 10) {
      currentHref.value = `#${sections[0]}`
      return
    }

    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const offsetTop = element.offsetTop
        const height = element.offsetHeight

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          currentHref.value = `#${section}`
          return
        }
      }
    }
  }

  // 使用节流函数优化滚动性能
  const throttle = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    let lastExecTime = 0
    return function (this: any, ...args: any[]) {
      const currentTime = Date.now()

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args)
        lastExecTime = currentTime
      } else {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func.apply(this, args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }

  const throttledUpdateCurrentHref = throttle(updateCurrentHref, 100)

  onMounted(() => {
    // 设置默认滚动到第一个锚点位置
    nextTick(() => {
      const targetElement = document.getElementById(sections[0])
      if (targetElement) {
        if (containerRef) {
          // 使用容器滚动
          containerRef.scrollTop = targetElement.offsetTop
          currentHref.value = `#${sections[0]}`
          containerRef.addEventListener('scroll', throttledUpdateCurrentHref)
        } else {
          // 使用页面滚动
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth',
          })
          currentHref.value = `#${sections[0]}`
          window.addEventListener('scroll', throttledUpdateCurrentHref)
        }

        // 初始化锚点高亮状态
        updateCurrentHref()
      }
    })
  })

  onUnmounted(() => {
    if (containerRef) {
      containerRef.removeEventListener('scroll', throttledUpdateCurrentHref)
    } else {
      window.removeEventListener('scroll', throttledUpdateCurrentHref)
    }
  })

  const handleClickAnchor = (e: Event) => {
    e.preventDefault()
    const target = e.target as HTMLAnchorElement
    const href = target.getAttribute('href')

    if (href) {
      const targetElement = document.querySelector(href)
      if (targetElement) {
        if (containerRef) {
          // 使用容器滚动
          containerRef.scrollTo({
            top: (targetElement as HTMLElement).offsetTop,
            behavior: 'smooth',
          })
        } else {
          // 使用页面滚动
          window.scrollTo({
            top: (targetElement as HTMLElement).offsetTop,
            behavior: 'smooth',
          })
        }
        currentHref.value = href
      }
    }
  }

  return {
    currentHref,
    handleClickAnchor,
  }
}
