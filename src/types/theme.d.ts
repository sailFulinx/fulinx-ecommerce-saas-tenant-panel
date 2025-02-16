interface ThemeListParams {
  themeName?: string | null
}

interface ThemeData {
  /* Theme ID */
  id: string

  /* Theme Name */
  themeName: string

  /* Theme Type, 1: open 2: describe 3: custom */
  themeType: number

  /* Theme Author */
  themeAuthor: string

  /* Theme Version */
  themeVersion: string

  /* Theme Thumb File ID */
  themeThumbFileId: string

  themeThumbFileVo: FileData

  /* Theme Config */
  themeConfig: string

  /* Soft Delete Flag */
  isDelete: number

  /* Remark */
  remark: string

  /* Record Version */
  recordVersion: number

  /* Record Create Name */
  recordCreateName: string

  /* Record Update Name */
  recordUpdateName: string

  /* Record Create Time */
  recordCreateTime: string

  /* Record Update Time */
  recordUpdateTime: string
}

interface ThemeRequest {
  /* Theme Name */
  themeName: string

  /* Theme Type */
  themeType: number | null

  /* Theme Author */
  themeAuthor: string

  /* Theme Version */
  themeVersion: string

  /* Theme Thumb File ID */
  themeThumbFileId?: string | null

  themeThumbFileVo?: FileData

  /* Theme Config */
  themeConfig?: string
}

interface ThemeConfigRequest {
  /* Theme Config */
  themeConfig: string
}

interface ThemeRemoveRequest {
  ids: string[]
}

interface LinkData {
  id?: number
  linkUrl: string
  linkValue: string
  linkLabel: string
  isSettingCustomRoute?: boolean
  customRoute?: string
  linkType: string
  children: LinkData[]
}

interface MenuData {
  id: number
  menuLabel: string
  link?: LinkData
  linkUrl: string
  linkValue: string
  linkType: string
  menuType?: 'none' | 'megaMenu' | 'dropDown'
  isDropDownCustom?: boolean
  image?: FileData
  children?: MenuData[]
}

interface ComponentConfig {
  content: any
  status: boolean
}

interface ComponentData {
  backendComponentCode: string
  componentConfig: ComponentConfig
  componentName: string
  isRequiredAliasName: boolean
  aliasName: string
  id: number
  sort: number
  frontComponentIdentifyCode: string
}

interface ReadContentData {
  readContentLabel: string
  readContentValue: string | null
  readContentType: string
}

interface MultiReadContentData {
  readContentLabel: string
  readContentValue: number | null
  readContentType: string
}

interface ThemeSettingGlobal {
  defaultHeaderComponentId: string | null
  defaultFooterComponentId: string | null
  homePageLayoutId: string | null
  supplierPageLayoutId: string | null
  helpPageLayoutId: string | null
}

interface ThemeSettingDataType {
  id: number
  themeSettingCode: string
  themeSettingName: string
  content: any
}

interface ElementData {
  elementComponentCode: string
  webComponentCode?: string
  elementComponentConfig: ComponentConfig
  elementName: string
  aliasName: string
  elementId?: number
  rowElementId?: number
  rowElementSort?: number
}

interface ComponentRowData {
  id: number
  rowName: string
  columnsCount: number
  isFullScreen: boolean
  rowGap: number
  marginTop: number
  marginBottom: number
  columns: ElementData[]
  sort: number
}

interface MultiImageTextItem {
  id: number
  image: FileData
  imageLink: LinkData
  alt: string
  title: string
  subTitle: string
  textList: string[]
  buttonText: string
  buttonLink: LinkData
  sort: number
}

interface CompElementFormData {
  elementComponentCode: string
  webComponentCode?: string
  aliasName: string
}
