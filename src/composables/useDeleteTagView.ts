import type { Router } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'

export function useDeleteTagView(router: Router, routeName: string, refresh = false) {
  const tagsViewStore = useTagsViewStore()
  if (!router) {
    console.error('Router instance is not available')
    return
  }

  if (refresh) {
    tagsViewStore.delCachedView()
  }

  if (router.currentRoute.value) {
    tagsViewStore.delVisitedView(router.currentRoute.value)
    router.push({ name: routeName })
  } else {
    console.error('Current route is not available')
  }
}
