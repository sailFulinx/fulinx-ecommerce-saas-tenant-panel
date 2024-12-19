import { importLogStatuses, importStatuses, importTypes } from '@/data/imp'

/**
 * 转换类型为文字
 * @param val
 * @returns
 */
export function convertImpTypes(val: number) {
  let label = ''
  importTypes.map((item: any) => {
    if (item.id === val) {
      label = item.label
    }
  })
  return label
}

/**
 * 转换状态为文字
 * @param val
 * @returns
 */
export function convertImpStatus(val: number) {
  let label = ''
  importStatuses.map((item: any) => {
    if (item.id === val) {
      label = item.label
    }
  })
  return label
}

/**
 * 转换状态为文字
 * @param val
 * @returns
 */
export function convertImpLogStatus(val: number) {
  let label = ''
  importLogStatuses.map((item: any) => {
    if (item.id === val) {
      label = item.label
    }
  })
  return label
}
