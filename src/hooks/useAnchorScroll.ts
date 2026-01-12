import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

interface AnchorScrollOptions {
  containerRef?: HTMLElement | null
  sections: string[]
}

export const useAnchorScroll = (options: AnchorScrollOptions) => {
  const { sections, containerRef } = options
  const _containerRef = ref<HTMLElement | null>(containerRef ?? null)

  // 添加响应式变量来跟踪当前激活的锚点
  const currentHref = ref(sections.length > 0 ? `#${sections[0]}` : '')

  // 添加函数来检测当前滚动位置对应的锚点
  const updateCurrentHref = () => {
    // 如果使用容器滚动
    if (_containerRef.value) {
      const scrollPosition = _containerRef.value.scrollTop + 100 // 添加偏移量以便提前识别

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

  const attachScrollListener = () => {
    if (_containerRef.value) {
      _containerRef.value.addEventListener('scroll', throttledUpdateCurrentHref)
    } else {
      window.addEventListener('scroll', throttledUpdateCurrentHref)
    }
  }

  const detachScrollListener = () => {
    if (_containerRef.value) {
      _containerRef.value.removeEventListener('scroll', throttledUpdateCurrentHref)
    } else {
      window.removeEventListener('scroll', throttledUpdateCurrentHref)
    }
  }

  onMounted(() => {
    // 设置默认滚动到第一个锚点位置
    nextTick(() => {
      const targetElement = document.getElementById(sections[0])
      if (targetElement) {
        if (_containerRef.value) {
          // 使用容器滚动
          _containerRef.value.scrollTop = targetElement.offsetTop
          // 先更新currentHref
          currentHref.value = `#${sections[0]}`
          // 添加微小延迟确保DOM完全渲染后再次更新
          setTimeout(() => {
            updateCurrentHref()
          }, 0)
          attachScrollListener()
        } else {
          // 使用页面滚动
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth',
          })
          // 先更新currentHref
          currentHref.value = `#${sections[0]}`
          // 添加微小延迟确保DOM完全渲染后再次更新
          setTimeout(() => {
            updateCurrentHref()
          }, 0)
          attachScrollListener()
        }
      }

      // 再次添加一个宏任务延迟，确保元素完全渲染后更新锚点状态
      setTimeout(() => {
        updateCurrentHref()
      }, 100)
    })
  })

  onUnmounted(() => {
    detachScrollListener()
  })

  // 监听容器引用的变化
  watch(_containerRef, (newContainer, oldContainer) => {
    if (oldContainer) {
      detachScrollListener()
    }

    if (newContainer) {
      attachScrollListener()
    } else {
      attachScrollListener() // 使用window滚动
    }
  })

  const handleClickAnchor = (e: Event) => {
    e.preventDefault()
    const target = e.target as HTMLAnchorElement
    const href = target.getAttribute('href')

    if (href) {
      const targetElement = document.querySelector(href)
      if (targetElement) {
        if (_containerRef.value) {
          // 使用容器滚动
          _containerRef.value.scrollTo({
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

        // 添加一个小延迟来确保滚动完成后再更新当前锚点状态
        setTimeout(() => {
          updateCurrentHref()
        }, 100)
      }
    }
  }

  return {
    currentHref,
    handleClickAnchor,
    updateContainerRef: (newContainer: HTMLElement | null) => {
      _containerRef.value = newContainer
    },
  }
}
