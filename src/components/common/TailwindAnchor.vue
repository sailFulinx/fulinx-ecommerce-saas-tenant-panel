<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

interface AnchorLink {
  href: string
  title: string
}

type Direction = 'vertical' | 'horizontal'

interface Props {
  links: AnchorLink[]
  container?: HTMLElement | null | { value?: HTMLElement | null }
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
// 修复容器引用处理
const containerRef = computed(() => {
  if (!props.container) {
    return document.documentElement
  }

  // 处理 ref 对象
  if (props.container && typeof props.container === 'object' && 'value' in props.container) {
    return props.container.value || document.documentElement
  }

  // 直接返回 HTMLElement
  return props.container as HTMLElement
})

const isVertical = computed(() => props.direction === 'vertical')

// 修复：获取所有锚点元素及其位置
const getAnchorsPosition = () => {
  const container = containerRef.value
  if (!container) {
    console.log('容器不存在')
    return []
  }

  const positions = []
  for (const link of props.links) {
    // 修复：确保选择器格式正确
    const selector = link.href.startsWith('#') ? link.href : `#${link.href}`
    const element = document.querySelector(selector)

    if (element) {
      let position = 0

      // 修复：统一使用 getBoundingClientRect 计算位置
      const elementRect = element.getBoundingClientRect()

      if (container === document.documentElement || container === document.body) {
        // 页面滚动 - 使用更准确的计算方式[1](@ref)
        position = elementRect.top + window.pageYOffset
      } else {
        // 容器内滚动 - 计算相对位置[4](@ref)
        const containerRect = container.getBoundingClientRect()
        position = elementRect.top - containerRect.top + container.scrollTop
      }

      positions.push({
        href: link.href,
        position: Math.max(0, Math.round(position)), // 确保位置不为负数
      })
    } else {
      console.warn(`未找到锚点元素: ${link.href}`)
    }
  }

  // 按照位置排序
  positions.sort((a, b) => a.position - b.position)
  console.log('锚点位置计算结果:', positions)
  return positions
}

// 修复：监听滚动事件
const handleScroll = () => {
  if (props.links.length === 0) {
    return
  }

  const anchors = getAnchorsPosition()
  if (anchors.length === 0) {
    return
  }

  const container = containerRef.value
  let scrollPosition = 0

  // 修复：统一获取滚动位置的方式[4](@ref)
  if (container === document.documentElement || container === document.body) {
    scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
  } else {
    scrollPosition = (container as HTMLElement).scrollTop
  }

  // 加上偏移量
  const adjustedScrollPosition = Math.max(0, scrollPosition + props.offset)

  // 查找当前应该激活的锚点
  let currentActive = anchors[0]?.href || ''

  // 修复：改进锚点激活逻辑[4](@ref)
  for (let i = anchors.length - 1; i >= 0; i--) {
    if (adjustedScrollPosition >= anchors[i].position - props.offset) {
      currentActive = anchors[i].href
      break
    }
  }

  // 更新激活的href
  if (activeHref.value !== currentActive && currentActive) {
    activeHref.value = currentActive
    console.log('当前激活的锚点:', currentActive, '滚动位置:', adjustedScrollPosition)
    emit('update:active-href', currentActive)
  }
}

// 修复：滚动到目标元素 - 使用更可靠的 scrollIntoView 方法[1](@ref)
const scrollToTarget = (href: string) => {
  // 修复：确保选择器格式正确
  const selector = href.startsWith('#') ? href : `#${href}`
  const targetElement = document.querySelector(selector) as HTMLElement

  if (targetElement) {
    const container = containerRef.value

    // 修复：使用 scrollIntoView 实现平滑滚动[1](@ref)
    if (container === document.documentElement || container === document.body) {
      // 页面滚动
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } else {
      // 容器内滚动
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    }

    // 添加延迟确保滚动完成
    setTimeout(() => {
      handleScroll() // 手动触发滚动更新
    }, 300)
  } else {
    console.error(`未找到目标元素: ${href}`)
  }
}

// 处理点击事件
const handleClick = (link: AnchorLink, event: MouseEvent) => {
  event.preventDefault()
  emit('click', link)

  // 更新激活的href
  activeHref.value = link.href
  emit('update:active-href', link.href)

  // 滚动到目标元素
  scrollToTarget(link.href)
}

// 监听 links 变化
watch(() => props.links, () => {
  nextTick(() => {
    setTimeout(() => {
      handleScroll() // 链接变化后重新计算位置
    }, 100)
  })
}, { deep: true })

// 容器类
const containerClass = computed(() => {
  return ['select-none']
})

// 列表类，根据方向变化
const listClass = computed(() => {
  return [isVertical.value ? 'space-y-1' : 'flex space-x-1']
})

const bindScrollListener = () => {
  const scrollContainer = containerRef.value
  console.log('绑定滚动监听，容器:', scrollContainer)

  if (scrollContainer && scrollContainer instanceof HTMLElement) {
    // 检查容器是否可滚动
    const canScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight
    console.log('容器可滚动状态:', canScroll)

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
  } else {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  // 初始计算
  setTimeout(handleScroll, 200)
}

// 修复：改进事件绑定逻辑
onMounted(() => {
  // 初始化时设置第一个为活跃项
  if (props.links.length > 0 && !activeHref.value) {
    activeHref.value = props.links[0].href
    emit('update:active-href', activeHref.value)
  }

  nextTick(() => {
    setTimeout(() => {
      bindScrollListener()
    }, 300)
  })
})

onUnmounted(() => {
  const scrollContainer = containerRef.value
  if (scrollContainer && scrollContainer instanceof HTMLElement) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  } else {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <nav :class="containerClass">
    <ul :class="listClass">
      <li v-for="(link, index) in links" :key="index">
        <a
          :href="link.href"
          class="text-sm transition-colors duration-200 cursor-pointer"
          :class="[
            isVertical ? 'block py-2 px-3' : 'inline-block px-3 py-2',
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
/* 确保锚点链接样式正确 */
a {
  text-decoration: none;
  border-radius: 4px;
}
</style>
