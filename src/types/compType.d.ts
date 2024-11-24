interface CreateComponentParams {
  /* Component Name */
  componentName: string

  /* Component Content */
  componentContent?: string
}

interface CopyComponentParams {
  /* Component ID */
  componentId: number
}

interface UpdateComponentParams {

  /* Component Name */
  componentName: string

  /* Component Content */
  componentContent?: string
}

interface CompData {
  /* Component ID */
  id: number

  /* Component Name */
  componentName: string

  /* Component Content */
  componentContent: string
}

interface RemoveCompParams {
  ids: number[]
}

interface CompListParams {
  /* Component ID */
  id?: number | null

  /* Component Name */
  componentName?: string | null
}
