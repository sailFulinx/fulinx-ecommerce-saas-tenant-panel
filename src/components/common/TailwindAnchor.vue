<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface AnchorLink {
  href: string
  title: string
}

type Direction = 'vertical' | 'horizontal'

interface Props {
  links: AnchorLink[]
  container?: HTMLElement | null
  offset?: number
  direction?: Direction
}

interface Emits {
  (e: 'click', link: AnchorLink): void
  (e: 'update:active-href', href: string): void
}

const props = withDefaults(defineProps<Props>(), {
  offset: 0,
  direction: 'vertical',
})

const emit = defineEmits<Emits>()

const activeHref = ref('')
const containerRef = computed(() => props.container || document.documentElement || document.body)
const isVertical = computed(() => props.direction === 'vertical')

// 获取所有锚点元素及其位置
const getAnchorsPosition = () => {
  if (!containerRef.value) {
    return []
  }

  const positions = []
  for (const link of props.links) {
    const element = document.querySelector(link.href)
    if (element) {
      let position
      if (containerRef.value === document.documentElement || containerRef.value === document.body) {
        // 如果是页面滚动，直接使用元素的offsetTop
        position = element instanceof HTMLElement ? element.offsetTop : 0
      } else {
        // 如果是指定容器滚动，计算元素相对于容器的位置
        const elementRect = element.getBoundingClientRect()
        const containerRect = containerRef.value.getBoundingClientRect
          ? containerRef.value.getBoundingClientRect()
          : { top: 0, left: 0 }

        const scrollTop = containerRef.value.scrollTop || 0
        const containerTop = containerRect.top

        // 计算元素相对于容器顶部的实际位置
        position = elementRect.top - containerTop + scrollTop
      }

      positions.push({
        href: link.href,
        position: Math.round(position),
      })
    }
  }

  // 按照位置排序
  positions.sort((a, b) => a.position - b.position)
  return positions
}

// 监听滚动事件
const handleScroll = () => {
  if (props.links.length === 0) {
    return
  }

  const anchors = getAnchorsPosition()
  if (anchors.length === 0) {
    return
  }

  let scrollPosition
  if (containerRef.value === document.documentElement || containerRef.value === document.body) {
    if (isVertical.value) {
      scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
    } else {
      scrollPosition = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft
    }
  } else {
    if (isVertical.value) {
      scrollPosition = (containerRef.value as HTMLElement).scrollTop
    } else {
      scrollPosition = (containerRef.value as HTMLElement).scrollLeft
    }
  }

  // 加上偏移量
  const adjustedScrollPosition = scrollPosition + props.offset

  // 查找当前应该激活的锚点
  let currentActive = anchors[0].href // 默认第一个

  // 寻找最接近当前位置的锚点
  for (let i = 0; i < anchors.length; i++) {
    const currentAnchor = anchors[i]
    const nextAnchor = i < anchors.length - 1 ? anchors[i + 1] : null
    // 如果滚动位置在当前锚点和下一个锚点之间，则激活当前锚点
    if (!nextAnchor || (adjustedScrollPosition >= currentAnchor.position && adjustedScrollPosition < nextAnchor.position)) {
      currentActive = currentAnchor.href
      break
    }
  }

  // 如果滚动位置还没达到第一个锚点的位置，则激活第一个锚点
  if (anchors.length > 0 && adjustedScrollPosition < anchors[0].position) {
    currentActive = anchors[0].href
  }

  // 更新激活的href
  if (activeHref.value !== currentActive) {
    activeHref.value = currentActive
    emit('update:active-href', currentActive)
  }
}

// 滚动到目标元素
const scrollToTarget = (href: string) => {
  const targetElement = document.querySelector(href) as HTMLElement
  if (targetElement) {
    const offsetTop = props.offset || 0
    const container = containerRef.value

    if (container === document.documentElement || container === document.body) {
      // 页面滚动
      window.scrollTo({
        top: targetElement.offsetTop - offsetTop,
        behavior: 'smooth',
      })
    } else {
      // 容器内滚动 - 需要使用容器的scrollTop而不是元素的offsetTop
      const elementRect = targetElement.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      let targetPosition

      if (container === document.documentElement || container === document.body) {
        targetPosition = targetElement.offsetTop - offsetTop
      } else {
        // 计算相对于容器的滚动位置
        const scrollTop = container.scrollTop || 0
        targetPosition = elementRect.top - containerRect.top + scrollTop - offsetTop
      }

      ;(container as HTMLElement).scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
    }

    // 添加一个小延迟来确保滚动完成后再更新当前锚点状态
    setTimeout(() => {
      // 手动触发滚动更新，确保高亮状态正确
      if (container === document.documentElement || container === document.body) {
        window.dispatchEvent(new Event('scroll'))
      } else {
        ;(container as HTMLElement).dispatchEvent(new Event('scroll'))
      }
    }, 100)
  }
}

// 处理点击事件
const handleClick = (link: AnchorLink, event: MouseEvent) => {
  event.preventDefault() // 阻止默认跳转行为
  emit('click', link)

  // 更新激活的href
  activeHref.value = link.href
  emit('update:active-href', link.href)

  // 滚动到目标元素
  scrollToTarget(link.href)
}

// 容器类
const containerClass = computed(() => {
  return ['select-none']
})

// 列表类，根据方向变化
const listClass = computed(() => {
  return [isVertical.value ? 'space-y-1' : 'flex space-x-1']
})

onMounted(() => {
  // 初始化时设置第一个为活跃项
  if (props.links.length > 0 && !activeHref.value) {
    activeHref.value = props.links[0].href
    console.log('activeHref', activeHref.value)
    emit('update:active-href', activeHref.value)
  }

  // 添加滚动监听
  const scrollContainer = containerRef.value
  if (scrollContainer) {
    // 监听滚动事件
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    // 初始时也触发一次滚动处理
    setTimeout(handleScroll, 100)
  }

  // 监听页面滚动
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  const scrollContainer = containerRef.value
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="containerClass">
    <ul :class="listClass">
      <li v-for="(link, index) in links" :key="index">
        <a
          :href="link.href"
          class="text-sm transition-colors duration-200"
          :class="[
            isVertical ? 'block py-2 px-3' : 'block px-3 py-2',
            activeHref === link.href
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
          @click="handleClick(link, $event)"
        >
          {{ link.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 样式已在模板的:class中定义 */
</style>
