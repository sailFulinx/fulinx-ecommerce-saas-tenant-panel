import type { ElDropdown } from 'element-plus'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface contextMenuSchema {
  disabled?: boolean
  divided?: boolean
  icon?: string
  label: string
  command?: (item: contextMenuSchema) => void
}

interface ContextMenuExpose {
  elDropdownMenuRef: ComponentRef<typeof ElDropdown>
  tagItem: RouteLocationNormalizedLoaded
}
