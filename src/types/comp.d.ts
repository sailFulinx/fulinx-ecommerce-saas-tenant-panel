interface CreateComponentParams {
  /* Component Name */
  componentName: string

  /* Component Content */
  componentContent?: string
}

interface CopyComponentParams {
  /* Component ID */
  componentId: string
}

interface UpdateComponentParams {

  /* Component Name */
  componentName: string

  /* Component Content */
  componentContent?: string
}

interface CompData {
  /* Component ID */
  id: string

  /* Component Name */
  componentName: string

  /* Component Content */
  componentContent: string
}

interface RemoveCompParams {
  ids: string[]
}

interface CompListParams {
  /* Component ID */
  id?: string | null

  /* Component Name */
  componentName?: string | null
}
