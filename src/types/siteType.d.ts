interface SiteListParams {
  siteName?: string | null
}

interface SiteData {
  /* Site ID */
  id: string

  themeId: string | null

  themeVo: ThemeData

  /* Domain */
  domain: string

  /* Language ID */
  languageId: string

  /* Site Name */
  siteName: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription: string

  /* Logo File ID */
  logoFileId: string

  /* Favicon File ID */
  faviconFileId: string

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  logoFileVo?: FileData
  faviconFileVo?: FileData

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

interface SiteRequest {
  themeId: string | null

  /* Domain */
  domain: string

  /* Language ID */
  languageId: string | null

  /* Site Name */
  siteName: string

  /* Meta Title */
  metaTitle: string

  /* Meta Description */
  metaDescription?: string

  /* Logo File ID */
  logoFileId: string | null

  /* Favicon File ID */
  faviconFileId?: string | null

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean | number

  logoFileVo?: FileData
  faviconFileVo?: FileData
}

interface SiteRemoveRequest {
  ids: string[]
}

interface SiteConfigMailSetting {
  /* Site ID */
  siteId: string

  /* SMTP Host */
  smtpHost: string

  /* SMTP Port */
  smtpPort: number

  /* From Email */
  fromEmail: string

  /* Username */
  username: string

  /* Password */
  password: string

  /* Starttls Enable */
  starttlsEnable: boolean
}

interface SiteConfigCheckoutSetting {
  /* Site ID */
  siteId: string

  /* Free Shipping Amount */
  freeShippingAmount: number

  defaultShippingAmount: number

  supportEmailAddress: string
}
