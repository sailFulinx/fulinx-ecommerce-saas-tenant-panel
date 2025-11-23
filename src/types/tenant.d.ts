interface TenantStoreCreateParams {
  storeName: string
}

interface TenantStoreUpdateParams {
  storeName: string
}

interface TenantStoreRemoveParams {
  storeIds: string[]
}

interface ShowStoreParams {
  tenantStoreId: string
}

interface StoreShowData {
  /* Tenant ID */
  tenantId: string

  /* Store Name */
  storeName: string

  /* Status: 1 - NORMAL, 2 - EXPIRED,  3 - TEMPORARILY_CLOSED  4 - PERMANENTLY_CLOSED */
  status: number

  /* Expire Time */
  expireTime: string
}

interface TenantStoreListParams {
  /* Tenant Store ID */
  id?: string

  /* Tenant ID */
  tenantId?: string

  /* Store Name */
  storeName?: string

  /* Store Db Name */
  storeDbName?: string

  /* Status: 1 - NORMAL, 2 - EXPIRED,  3 - TEMPORARILY_CLOSED  4 - PERMANENTLY_CLOSED */
  status?: number

  /* Soft Delete Flag */
  isDelete?: number
}

interface TenantStoreListData {
  /* Tenant ID */
  tenantId: string

  /* Store Name */
  storeName: string

  /* Status: 1 - NORMAL, 2 - EXPIRED,  3 - TEMPORARILY_CLOSED  4 - PERMANENTLY_CLOSED */
  status: number

  /* Expire Time */
  expireTime: Record<string, unknown>
}
