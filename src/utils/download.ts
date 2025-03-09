import { formatTime, validateTimes } from '@/utils'
import { downExcel, downExcelMultipleSheets } from './json2excel'

const productThs: string[] = [
  'sku',
  '图片所属文件夹',
  '产品供应商编码',
  '产品名称',
  '产品描述',
  '产品价格',
  '在库库存',
  '在途库存',
  '在途发货天数',
  '供应商名称',
  '产品分类',
  '参数',
]

const productFields: string[] = [
  'sku',
  'imagePath',
  'mpn',
  'productName',
  'productDescription',
  'productPrice',
  'inStockQuantity',
  'processingQuantity',
  'processingDays',
  'supplierName',
  'categoryName',
  'parameter',
]

export async function downloadProduct(data: ProductExportListData[]) {
  const fields: string[] = productFields

  const ths: string[] = productThs

  downExcel(ths, fields, '产品', data, '产品')
}
