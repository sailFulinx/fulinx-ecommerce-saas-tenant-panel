interface CreateShippingCompanyParams {
  /* Shipping Company Name */
  shippingCompanyName: string
}

interface CreateShippingCompanyRes {
  /* Shipping Company Name */
  shippingCompanyName: string
}

interface RemoveShippingCompanyParams {
  /* Shipping Company Ids */
  ids: string[]
}

interface UpdateShippingCompanyParams {
  /* Shipping Company ID */
  shippingCompanyId: string

  /* Shipping Company Name */
  shippingCompanyName: string
}

interface ShippingCompanyListParams {
  /* Shipping Company ID */
  id?: string

  /* Shipping Company Name */
  shippingCompanyName?: string | null

  /* Soft Delete Flag */
  isDelete?: number
}

interface ShippingCompanyListData {
  /* Shipping Company Name */
  shippingCompanyName: string
}

interface ShippingCompanyShow {
  /* Shipping Company Name */
  shippingCompanyName: string
}

interface CreateShippingCompanyTemplateParams {
  /* Shipping Company ID */
  shippingCompanyId: string

  shippingCompanyTemplateName: string

  /* Shipping Rules */
  shippingRules: string

  /* Is Default */
  isDefault: boolean
}

interface CreateShippingCompanyTemplateRes {
  /* Shipping Company ID */
  shippingCompanyId: string

  shippingCompanyTemplateName: string

  /* Shipping Rules */
  shippingRules: string

  /* Is Default */
  isDefault: boolean
}

interface RemoveShippingCompanyTemplateParams {
  /* Shipping Company Ids */
  ids: string[]
}

interface UpdateShippingCompanyTemplateParams {
  /* Shipping Company Template ID */
  shippingCompanyTemplateId: string

  shippingCompanyTemplateName: string

  /* Shipping Rules */
  shippingRules: string

  /* Is Default */
  isDefault: boolean
}

interface ShippingCompanyTemplateListParams {
  /* Shipping Company Template ID */
  id?: string

  /* Shipping Company ID */
  shippingCompanyId?: string

  /* Is Default */
  isDefault?: boolean

  /* Soft Delete Flag */
  isDelete?: number
}

interface ShippingCompanyTemplateListData {
  /* Shipping Company ID */
  shippingCompanyId: string

  shippingCompanyTemplateName: string

  /* Shipping Rules */
  shippingRules: string

  /* Is Default */
  isDefault: boolean
}

interface ShippingCompanyTemplateShow {
  shippingCompanyTemplateId?: string
  /* Shipping Company ID */
  shippingCompanyId: string

  shippingCompanyTemplateName: string

  /* Shipping Rules */
  shippingRules: string

  /* Is Default */
  isDefault: boolean
}
