interface CreateLayoutParams {
  /* Layout Name */
  layoutName: string

  /* Layout File ID */
  layoutFileId?: number

  /* Layout Content */
  layoutContent?: string
}

interface CopyLayoutParams {
  /* Layout ID */
  layoutId: string
}

interface RemoveLayoutParams {
  /* Layout Ids */
  ids: string[]
}

interface UpdateLayoutParams {
  /* Layout Name */
  layoutName: string

  /* Layout File ID */
  layoutFileId?: number

  /* Layout Content */
  layoutContent?: string
}

interface LayoutListParams {
  /* Layout ID */
  id?: number

  /* Layout Name */
  layoutName?: string | null

  /* Soft Delete Flag */
  isDelete?: number
}

interface LayoutData {
  /* Layout ID */
  id?: string

  /* Layout Name */
  layoutName: string

  /* Layout File ID */
  layoutFileId?: string

  /* */
  fileVo?: FileData & CommonField

  /* Layout Content */
  layoutContent?: string
}

interface LayoutComponentData {
  id: number
  componentId: string
  componentName?: string
  sort: number
}

interface LayoutRowData {
  id: number
  rowName: string
  columnsCount: number
  columns: LayoutComponentData[]
  sort: number
}

interface LayoutComponentForm {
  componentId: string | null
}
