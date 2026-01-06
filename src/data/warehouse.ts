import { Warehouse } from '@/types/warehouse'

/**
 * 获取默认仓库数据
 */
export const getDefaultWarehouse = (): Omit<Warehouse, 'id'> => {
  return {
    warehouseName: '',
    firstName: '',
    lastName: '',
    regionCountryId: '',
    regionCountryName: '',
    regionStateId: '',
    regionStateName: '',
    regionCityId: '',
    regionCityName: '',
    address1: '',
    address2: '',
    telephone: '',
    postcode: '',
    warehouseType: 2, // 默认为自定义
    isDefault: false,
    sort: 0,
    remark: '',
  }
}

/**
 * 仓库类型选项
 */
export const warehouseTypeOptions = [
  { label: 'System', value: 1 },
  { label: 'Custom', value: 2 },
]

/**
 * 仓库类型映射
 */
export const warehouseTypeMap = {
  1: 'System',
  2: 'Custom',
}

/**
 * 仓库类型国际化映射
 */
export const warehouseTypeI18nMap = {
  1: 'warehouse.system',
  2: 'warehouse.custom',
}

/**
 * 仓库状态选项
 */
export const warehouseStatusOptions = [
  { label: 'Default', value: true },
  { label: 'Not Default', value: false },
]

/**
 * 仓库状态国际化映射
 */
export const warehouseStatusI18nMap = {
  true: 'warehouse.default',
  false: 'warehouse.notDefault',
}