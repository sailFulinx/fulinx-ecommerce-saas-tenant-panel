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
  id?: number

  /* Layout Name */
  layoutName: string

  /* Layout File ID */
  layoutFileId?: number

  /* */
  fileVo?: FileData & CommonField

  /* Layout Content */
  layoutContent?: string
}

interface LayoutComponentData {
  id: string
  componentId: string
  componentName?: string
  sort: number
}

interface LayoutRowData {
  id: string
  rowName: string
  columnsCount: number
  columns: LayoutComponentData[]
  sort: number
}

interface LayoutComponentForm {
  componentId: string | null
}
