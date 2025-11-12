<script setup lang="ts">
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import type { ContextMenuExpose } from '@/types/contextMenu'
// import { useTemplateRefsList } from '@vueuse/core'
// import { ElScrollbar } from 'element-plus'
// import { useRouter } from 'vue-router'
// import { useLocale } from '@/hooks/useLocale'
// import { useScrollTo } from '@/hooks/useScrollTo'
// import { usePermissionStore } from '@/stores/permission'
// import { useTagsViewStore } from '@/stores/tagsView'
import { filterAffixTags } from '@/utils/tagsView'
import ContextMenu from '../common/Menu/ContextMenu.vue'

const { t } = useLocale()

const { currentRoute, push, replace } = useRouter()

const permissionStore = usePermissionStore()

const routers = computed(() => permissionStore.getRouters)

const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.getVisitedViews)

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

// 初始化tag
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers))
  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

const selectedTag = ref<RouteLocationNormalizedLoaded>()

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    selectedTag.value = unref(currentRoute)
    tagsViewStore.addView(unref(currentRoute))
  }
  return false
}

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

// 跳转到最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path
      || unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags()
      return
    }
    // You can set another route
    push(permissionStore.getAddRouters[0].path)
  }
}

// 关闭选中的tag
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  if (view?.meta?.affix) {
    return
  }
  tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView()
  }
}

// 关闭全部
const closeAllTags = () => {
  tagsViewStore.delAllViews()
  toLastView()
}

// 关闭其他
const closeOthersTags = () => {
  tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 重新加载
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  if (!view) {
    return
  }
  tagsViewStore.delCachedView()
  const { path, query } = view
  await nextTick()
  replace({
    path: `/redirect${path}`,
    query,
  })
}

// 关闭左侧
const closeLeftTags = () => {
  tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 关闭右侧
const closeRightTags = () => {
  tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

// elscroll 实例
const scrollbarRef = useTemplateRef<CompInstance['ElScrollbar']>('scrollbarRef')

// 保存滚动位置
const scrollLeftNumber = ref(0)

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  let firstTag: Nullable<RouterLinkProps> = null
  let lastTag: Nullable<RouterLinkProps> = null

  const tagList = unref(tagLinksRefs)
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 直接滚动到0的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500,
    })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 滚动到最后的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      duration: 500,
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex(
      item => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath,
    )
    const tgsRefs = document.getElementsByClassName('tag__item')

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500,
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500,
      })
      start()
    }
  }
}

// 滚动到选中的tag
const moveToCurrentTag = async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).path) {
      moveToTarget(v)
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute))
      }

      break
    }
  }
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单装填改变的时候
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
      }
    }
  }
}

const scroll = ({ scrollLeft }: any) => {
  scrollLeftNumber.value = scrollLeft as number
}

// 移动到某个位置
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500,
  })
  start()
}

onMounted(() => {
  initTags()
  addTags()
})

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  },
)
</script>

<template>
  <div id="tags-view" class="tags-view flex w-full relative items-center h-[var(--tags-view-height)]">
    <span
      class="text-center leading-[var(--tags-view-height)] cursor-pointer border border-gray-200 dark:border-gray-400 rounded px-3 py-1.65 mx-1"
      @click="move(-200)"
    >
      <Icon icon="ep:d-arrow-left" :size="4" />
    </span>

    <div class="overflow-hidden flex-1">
      <ElScrollbar ref="scrollbarRef" @scroll="scroll">
        <div class="flex h-full w-full">
          <ContextMenu
            v-for="item in visitedViews"
            :ref="itemRefs.set"
            :key="item.fullPath"
            :schema="[
              {
                icon: 'ant-design:sync-outlined',
                label: t('common.reload'),
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  refreshSelectedTag(item)
                },
              },
              {
                icon: 'ant-design:close-outlined',
                label: t('common.closeTab'),
                disabled: !!visitedViews?.length && (selectedTag?.meta as RouteMeta)?.affix,
                command: () => {
                  closeSelectedTag(item)
                },
              },
              {
                divided: true,
                icon: 'ant-design:vertical-right-outlined',
                label: t('common.closeTheLeftTab'),
                disabled:
                  !!visitedViews?.length
                  && (item.fullPath === visitedViews[0].fullPath
                    || selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeLeftTags()
                },
              },
              {
                icon: 'ant-design:vertical-left-outlined',
                label: t('common.closeTheRightTab'),
                disabled:
                  !!visitedViews?.length
                  && (item.fullPath === visitedViews[visitedViews.length - 1].fullPath
                    || selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeRightTags()
                },
              },
              {
                divided: true,
                icon: 'ant-design:tag-outlined',
                label: t('common.closeOther'),
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  closeOthersTags()
                },
              },
              {
                icon: 'ant-design:line-outlined',
                label: t('common.closeAll'),
                command: () => {
                  closeAllTags()
                },
              },
            ]"
            :tag-item="item"
            class="tag__item flex items-center"
            :class="[
              {
                'is-active': isActive(item),
              },
            ]"
            @visible-change="visibleChange"
          >
            <div>
              <RouterLink :ref="tagLinksRefs.set" v-slot="{ navigate }" :to="{ ...item }" custom>
                <div
                  class="h-full flex justify-center items-center whitespace-nowrap border border-gray-200 dark:border-gray-400 rounded py-1.65 px-5 mr-1 relative group"
                  :class="[isActive(item) ? 'bg-blue-400 text-white' : 'bg-white text-black hover:bg-gray-100']"
                  @click="navigate"
                >
                  <span class="text-sm">{{ t(item?.meta?.title as string) }}</span>
                  <Icon
                    :color="isActive(item) ? 'white' : 'black'"
                    icon="ant-design:close-outlined"
                    :size="3"
                    class="ml-2 absolute right-[-8px] group-hover:right-[4px] hidden group-hover:block transition-all duration-300"
                    @click.stop="closeSelectedTag(item)"
                  />
                </div>
              </RouterLink>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>

    <span
      class="text-center leading-[var(--tags-view-height)] cursor-pointer border border-gray-200 dark:border-gray-400 rounded px-3 py-1.65 mr-1"
      @click="move(200)"
    >
      <Icon icon="ep:d-arrow-right" :size="4" />
    </span>

    <span
      class="text-center leading-[var(--tags-view-height)] cursor-pointer border border-gray-200 dark:border-gray-400 rounded px-3 py-1.65"
      @click="refreshSelectedTag(selectedTag)"
    >
      <Icon icon="ant-design:reload-outlined" :size="4" />
    </span>

    <ContextMenu
      trigger="click"
      :schema="[
        {
          icon: 'ant-design:sync-outlined',
          label: t('common.reload'),
          command: () => {
            refreshSelectedTag(selectedTag)
          },
        },
        {
          icon: 'ant-design:close-outlined',
          label: t('common.closeTab'),
          disabled: !!visitedViews?.length && (selectedTag?.meta as RouteMeta)?.affix,
          command: () => {
            closeSelectedTag(selectedTag!)
          },
        },
        {
          divided: true,
          icon: 'ant-design:vertical-right-outlined',
          label: t('common.closeTheLeftTab'),
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
          command: () => {
            closeLeftTags()
          },
        },
        {
          icon: 'ant-design:vertical-left-outlined',
          label: t('common.closeTheRightTab'),
          disabled:
            !!visitedViews?.length
            && selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
          command: () => {
            closeRightTags()
          },
        },
        {
          divided: true,
          icon: 'ant-design:tag-outlined',
          label: t('common.closeOther'),
          command: () => {
            closeOthersTags()
          },
        },
        {
          icon: 'ant-design:line-outlined',
          label: t('common.closeAll'),
          command: () => {
            closeAllTags()
          },
        },
      ]"
    >
      <span
        class="text-center leading-[var(--tags-view-height)] cursor-pointer border border-gray-200 dark:border-gray-400 rounded px-3 py-1.65 mx-1"
      >
        <Icon icon="ant-design:setting-outlined" :size="4" />
      </span>
    </ContextMenu>
  </div>
</template>
