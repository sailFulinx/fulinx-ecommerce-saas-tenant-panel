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
  layoutId: number
}

interface RemoveLayoutParams {
  /* Layout Ids */
  ids: number[]
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
  id: number
  componentId: number
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
  componentId: number | null
}
