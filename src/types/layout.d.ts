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

interface ListLayoutTypeParams {
  /* Layout Type */
  layoutTypeCode?: string | null
}

interface LayoutTypeData {
  /* Layout Type ID */
  id: string

  /* Layout Type Code */
  code: string

  /* Layout Type Name */
  layoutTypeName: string
}

// 定义响应式数据，包含PC端、平板端和手机端的布局数据以及响应式数据
interface DeviceLayout {
  responsive: ComponentRowData[]
  pc: ComponentRowData[]
  pad: ComponentRowData[]
  mobile: ComponentRowData[]
  isResponsiveMode?: boolean // 添加模式状态字段
}
