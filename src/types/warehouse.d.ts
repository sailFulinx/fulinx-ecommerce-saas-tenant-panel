interface CreateWarehouseParams {
  /* Warehouse Name */
  warehouseName: string

  /* First Name */
  firstName: string

  /* Last Name */
  lastName: string

  /* Region Country ID */
  regionCountryId: string

  /* Region Country Name */
  regionCountryName: string

  /* Region State ID */
  regionStateId: string

  /* Region State Name */
  regionStateName: string

  /* Region City ID */
  regionCityId: string

  /* Region City Name */
  regionCityName: string

  /* Warehouse Address 1 */
  address1: string

  /* Warehouse Address 2 */
  address2?: string

  /* Telephone */
  telephone: string

  /* Postcode */
  postcode: string

  /* Warehouse Type, 1: System 2:custom */
  warehouseType: number

  /* Sort */
  sort: number
}

interface CreateWarehouseRes {
  /* Warehouse Type, 1: System 2:custom */
  warehouseType: number

  /* Warehouse Name */
  warehouseName: string

  /* First Name */
  firstName: string

  /* Last Name */
  lastName: string

  /* Region Country ID */
  regionCountryId: string

  /* Region Country Name */
  regionCountryName: string

  /* Region State ID */
  regionStateId: string

  /* Region State Name */
  regionStateName: string

  /* Region City ID */
  regionCityId: string

  /* Region City Name */
  regionCityName: string

  /* Warehouse Address 1 */
  address1: string

  /* Warehouse Address 2 */
  address2: string

  /* Telephone */
  telephone: string

  /* Postcode */
  postcode: string

  /* Is Default, 0: No, 1: Yes */
  isDefault: boolean

  /* Sort */
  sort: number
}

interface RemoveWarehouseParams {
  /* Warehouse IDs */
  ids?: string[]
}

interface WarehouseData {
  /* Warehouse Type, 1: System 2:custom */
  warehouseType: number

  /* Warehouse Name */
  warehouseName: string

  /* First Name */
  firstName: string

  /* Last Name */
  lastName: string

  /* Region Country ID */
  regionCountryId: string

  /* Region Country Name */
  regionCountryName: string

  /* Region State ID */
  regionStateId: string

  /* Region State Name */
  regionStateName: string

  /* Region City ID */
  regionCityId: string

  /* Region City Name */
  regionCityName: string

  /* Warehouse Address 1 */
  address1: string

  /* Warehouse Address 2 */
  address2: string

  /* Telephone */
  telephone: string

  /* Postcode */
  postcode: string

  /* Is Default, 0: No, 1: Yes */
  isDefault: boolean
}

interface UpdateWarehouseParams {
  /* Warehouse ID */
  warehouseId: string

  /* Warehouse Name */
  warehouseName: string

  /* First Name */
  firstName: string

  /* Last Name */
  lastName: string

  /* Region Country ID */
  regionCountryId: string

  /* Region Country Name */
  regionCountryName: string

  /* Region State ID */
  regionStateId: string

  /* Region State Name */
  regionStateName: string

  /* Region City ID */
  regionCityId: string

  /* Region City Name */
  regionCityName: string

  /* Warehouse Address 1 */
  address1: string

  /* Warehouse Address 2 */
  address2?: string

  /* Telephone */
  telephone: string

  /* Postcode */
  postcode: string

  /* Warehouse Type, 1: System 2:custom */
  warehouseType: number

  /* Sort */
  sort: number
}

interface WarehouseListParams {
  /* Warehouse ID */
  id?: string

  /* Warehouse Type, 1: System 2:custom */
  warehouseType?: number

  /* Warehouse Name */
  warehouseName?: string | null

  /* Is Default, 0: No, 1: Yes */
  isDefault?: boolean

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean

  /* 删除标识 */
  isDelete?: number
}

interface UpdateWarehouseIsDefaultParams {
  /* Warehouse ID */
  warehouseId: string
}

interface UpdateWarehouseStatusParams {
  /* Warehouse ID */
  warehouseId: string
}
